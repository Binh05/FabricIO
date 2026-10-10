package fabricio.backend.auth.application;

import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.security.SecureRandom;
import java.time.Duration;

import fabricio.backend.auth.domain.AuthRepository;
import fabricio.backend.users.CreateUserCommand;
import fabricio.backend.users.UserAuthInfo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import fabricio.backend.auth.application.dtos.*;
import fabricio.backend.auth.domain.Session;
import fabricio.backend.shared.security.JwtTokenProvider;
import fabricio.backend.shared.security.UserPrincipal;
import fabricio.backend.users.UserApi;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserApi UserApi;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthRepository authRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String register(RegisterRequest req) {
        if (UserApi.existsByEmail(req.email())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if (UserApi.existsByUsername(req.username())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        String hashPassword = passwordEncoder.encode(req.password());

        UserApi.createUser(new CreateUserCommand(req.username(), req.email(), req.fullName(), hashPassword));

        return "Đăng ký thành công";
    }

    public LoginResult login(LoginRequest req) {
        var user = UserApi.findUserAuthInfoByUsername(req.username())
        .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_ERROR));

        if (!passwordEncoder.matches(req.password(), user.hashedPassword())) {
            throw new AppException(ErrorCode.ACCOUNT_ERROR);
        }
        
        var refreshToken = newRefreshToken();
        authRepository.save(Session.create(user.id(), refreshToken, Duration.ofDays(7)));

        return new LoginResult(refreshToken, tokenProvider.generateToken(toPrincipal(user)));
    }

    public void signout(String token) {
        authRepository.deleteByToken(token);
    }

    public JwtResponse refresh(String token) {
        var session = authRepository.findByToken(token)
                .filter(s -> !s.isExpired())
                .orElseThrow(() -> new AppException(ErrorCode.ACCESS_DENIED));

        var user = UserApi.findUserAuthInfoById(session.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.ACCESS_DENIED));

        return new JwtResponse(tokenProvider.generateToken(toPrincipal(user)));
    }

    private UserPrincipal toPrincipal(UserAuthInfo user) {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE" + user.role().name()));
        user.permission().forEach(p -> authorities.add(new SimpleGrantedAuthority(p)));
        return new UserPrincipal(
                user.id(),
                user.username(),
                user.email(),
                user.hashedPassword(),
                user.role(),
                authorities
        );
    }

    private String newRefreshToken() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }
}


