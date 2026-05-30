package fabricio.backend.modules.auth;

import java.util.HexFormat;
import java.util.List;
import java.security.SecureRandom;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import fabricio.backend.modules.auth.dtos.JwtResponse;
import fabricio.backend.modules.auth.dtos.LoginRequest;
import fabricio.backend.modules.auth.dtos.RegisterRequest;
import fabricio.backend.modules.auth.jwt.JwtTokenProvider;
import fabricio.backend.modules.auth.jwt.UserPrincipal;
import fabricio.backend.modules.users.internal.IUserInternalService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final IUserInternalService userInternalService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public String register(RegisterRequest req) {
        if (userInternalService.exitsByEmail(req.email())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        if (userInternalService.existsByUsername(req.username())) {
            throw new RuntimeException("Username đã được sử dụng!");
        }

        String hashPassword = passwordEncoder.encode(req.password());

        userInternalService.createUserFromAuth(req.username(), req.email(), req.fullName(), hashPassword);

        return "Đăng ký thành công";
    }

    @Override
    public JwtResponse login(LoginRequest req) {
        var user = userInternalService.findByUsernameForAuth(req.username())
        .orElseThrow(() -> new RuntimeException("Tài khoản hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(req.password(), user.hashedPassword())) {
            throw new RuntimeException("Tài khoản hoặc mật khẩu không đúng");
        }

        // Tạo UserPrincipal từ thông tin trong database
        UserPrincipal userPrincipal = new UserPrincipal(
            user.id(),
            user.username(),
            user.email(),
            user.hashedPassword(),
            List.of()
        );

        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        
        var refreshToken = HexFormat.of().formatHex(bytes);
        var accessToken = tokenProvider.generateToken(userPrincipal);

        return new JwtResponse(refreshToken, accessToken);
    }
}


