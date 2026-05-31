package fabricio.backend.modules.auth;

import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import fabricio.backend.modules.auth.dtos.JwtResponse;
import fabricio.backend.modules.auth.dtos.LoginRequest;
import fabricio.backend.modules.auth.dtos.LoginResult;
import fabricio.backend.modules.auth.dtos.RegisterRequest;
import fabricio.backend.modules.auth.entities.Session;
import fabricio.backend.modules.auth.jwt.JwtTokenProvider;
import fabricio.backend.modules.auth.jwt.UserPrincipal;
import fabricio.backend.modules.users.internal.IUserInternalService;
import fabricio.backend.shared.enums.UserRole;
import fabricio.backend.shared.exceptions.BadRequestException;
import fabricio.backend.shared.exceptions.ForbiddenException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import fabricio.backend.modules.users.RolePermissionRepository;
import fabricio.backend.modules.users.entities.RolePermission;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final IUserInternalService userInternalService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthRepository authRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    @Transactional
    public String register(RegisterRequest req) {
        if (userInternalService.exitsByEmail(req.email())) {
            throw new BadRequestException("Email đã được sử dụng!");
        }

        if (userInternalService.existsByUsername(req.username())) {
            throw new BadRequestException("Username đã được sử dụng!");
        }

        String hashPassword = passwordEncoder.encode(req.password());

        userInternalService.createUserFromAuth(req.username(), req.email(), req.fullName(), hashPassword);

        return "Đăng ký thành công";
    }

    @Override
    public LoginResult login(LoginRequest req) {
        var user = userInternalService.findByUsernameForAuth(req.username())
        .orElseThrow(() -> new BadRequestException("Tài khoản hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(req.password(), user.getHashedPassword())) {
            throw new BadRequestException("Tài khoản hoặc mật khẩu không đúng");
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
    public JwtResponse refresh(String token) {
        var session = authRepository.findByToken(token);

        if (session == null) {
            throw new ForbiddenException("Token đã hết hạn hoặc không hợp lệ");
        }

        if (session.getExpiresAt().isBefore(Instant.now())) {
            throw new ForbiddenException("Token đã hết hạn hoặc không hợp lệ");
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


