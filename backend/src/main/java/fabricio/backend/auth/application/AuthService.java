package fabricio.backend.auth.application;

import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

import fabricio.backend.auth.domain.AuthRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import fabricio.backend.auth.application.dtos.JwtResponse;
import fabricio.backend.auth.application.dtos.LoginRequest;
import fabricio.backend.auth.application.dtos.LoginResult;
import fabricio.backend.auth.application.dtos.RegisterRequest;
import fabricio.backend.auth.domain.Session;
import fabricio.backend.shared.jwt.JwtTokenProvider;
import fabricio.backend.shared.jwt.UserPrincipal;
import fabricio.backend.users.UserApi;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.enums.UserRole;
import fabricio.backend.shared.exceptions.AppException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import fabricio.backend.users.domain.RolePermissionRepository;
import fabricio.backend.users.domain.RolePermission;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserApi userInternalService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthRepository authRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional
    public String register(RegisterRequest req) {
        if (userInternalService.exitsByEmail(req.email())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if (userInternalService.existsByUsername(req.username())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        String hashPassword = passwordEncoder.encode(req.password());

        userInternalService.createUserFromAuth(req.username(), req.email(), req.fullName(), hashPassword);

        return "Đăng ký thành công";
    }

    @Override
    public LoginResult login(LoginRequest req) {
        var user = userInternalService.findByUsernameForAuth(req.username())
        .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_ERROR));

        if (!passwordEncoder.matches(req.password(), user.getHashedPassword())) {
            throw new AppException(ErrorCode.ACCOUNT_ERROR);
        }

        List<SimpleGrantedAuthority> authorities = getAuthorities(user.getRole());

        // Tạo UserPrincipal từ thông tin trong database
        UserPrincipal userPrincipal = new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getHashedPassword(),
            user.getRole(),
            authorities
        );

        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        
        var refreshToken = HexFormat.of().formatHex(bytes);
        var accessToken = tokenProvider.generateToken(userPrincipal);

        Session session = new Session();
        session.setUser(user);
        session.setToken(refreshToken);
        session.setExpiresAt(Instant.now().plus(Duration.ofDays(7)));
        
        authRepository.save(session);

        return new LoginResult(refreshToken, accessToken);
    }

    @Override
    public void signout(String token) {
        var session = authRepository.findByToken(token);

        authRepository.delete(session);
    }

    @Override
    public JwtResponse refresh(String token, HttpServletResponse response) {
        var session = authRepository.findByToken(token);

        if (session == null) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        if (session.getExpiresAt().isBefore(Instant.now())) {
            Cookie cookie = new Cookie("refreshToken", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        var user = session.getUser();
        List<SimpleGrantedAuthority> authorities = getAuthorities(user.getRole());
        
        UserPrincipal userPrincipal = new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getHashedPassword(),
            user.getRole(),
            authorities
        );

        var newToken = tokenProvider.generateToken(userPrincipal);

        return new JwtResponse(newToken);
    }

    private List<SimpleGrantedAuthority> getAuthorities(UserRole role) {
        List<RolePermission> rolePermissions = rolePermissionRepository.findByRole(role);
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
        
        for (RolePermission rp : rolePermissions) {
            authorities.add(new SimpleGrantedAuthority(rp.getPermission().getName()));
        }
        return authorities;
    }
}


