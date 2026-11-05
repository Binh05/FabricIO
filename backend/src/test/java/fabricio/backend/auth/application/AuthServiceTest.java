package fabricio.backend.auth.application;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import fabricio.backend.auth.application.dtos.JwtResponse;
import fabricio.backend.auth.application.dtos.LoginRequest;
import fabricio.backend.auth.application.dtos.LoginResult;
import fabricio.backend.auth.application.dtos.RegisterRequest;
import fabricio.backend.auth.domain.AuthRepository;
import fabricio.backend.auth.domain.Session;
import fabricio.backend.auth.domain.exception.AuthErrorCode;
import fabricio.backend.auth.domain.exception.AuthException;
import fabricio.backend.shared.security.JwtTokenProvider;
import fabricio.backend.shared.security.Role;
import fabricio.backend.shared.security.UserPrincipal;
import fabricio.backend.users.CreateUserCommand;
import fabricio.backend.users.UserApi;
import fabricio.backend.users.UserAuthInfo;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserApi userApi;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthRepository authRepository;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private UserAuthInfo userAuthInfo;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        registerRequest = new RegisterRequest("john@example.com", "john", "John Doe", "password123");
        loginRequest = new LoginRequest("john", "password123");
        userAuthInfo = new UserAuthInfo(
                userId,
                "john@example.com",
                "john",
                "John Doe",
                "hashed-secret",
                Role.User,
                Collections.emptySet()
        );
    }

    // ==================== REGISTER ====================

    @Test
    @DisplayName("register: thành công khi email và username chưa tồn tại")
    void register_success() {
        when(userApi.existsByEmail(registerRequest.email())).thenReturn(false);
        when(userApi.existsByUsername(registerRequest.username())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.password())).thenReturn("hashed-secret");

        authService.register(registerRequest);

        verify(userApi).createUser(argThat(cmd ->
                cmd.username().equals("john") &&
                cmd.email().equals("john@example.com") &&
                cmd.fullName().equals("John Doe") &&
                cmd.passwordHash().equals("hashed-secret")
        ));
    }

    @Test
    @DisplayName("register: ném lỗi EMAIL_EXISTED khi email đã tồn tại")
    void register_emailExisted_throwsException() {
        when(userApi.existsByEmail(registerRequest.email())).thenReturn(true);

        AuthException exception = assertThrows(AuthException.class, () -> authService.register(registerRequest));

        assertEquals(AuthErrorCode.EMAIL_EXISTED.name(), exception.getCode());
        assertEquals(409, exception.getStatus());
        verify(userApi, never()).createUser(any());
    }

    @Test
    @DisplayName("register: ném lỗi USERNAME_EXISTED khi username đã tồn tại")
    void register_usernameExisted_throwsException() {
        when(userApi.existsByEmail(registerRequest.email())).thenReturn(false);
        when(userApi.existsByUsername(registerRequest.username())).thenReturn(true);

        AuthException exception = assertThrows(AuthException.class, () -> authService.register(registerRequest));

        assertEquals(AuthErrorCode.USERNAME_EXISTED.name(), exception.getCode());
        assertEquals(409, exception.getStatus());
        verify(userApi, never()).createUser(any());
    }

    // ==================== LOGIN ====================

    @Test
    @DisplayName("login: thành công khi đúng thông tin đăng nhập")
    void login_success() {
        when(userApi.findUserAuthInfoByUsername("john")).thenReturn(Optional.of(userAuthInfo));
        when(passwordEncoder.matches("password123", "hashed-secret")).thenReturn(true);
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("access-jwt-token");

        LoginResult result = authService.login(loginRequest);

        assertNotNull(result);
        assertEquals("access-jwt-token", result.accessToken());
        assertNotNull(result.refreshToken());
        assertFalse(result.refreshToken().isBlank());

        verify(authRepository).save(argThat(session ->
                session.getUserId().equals(userId) &&
                session.getToken().equals(result.refreshToken())
        ));
    }

    @Test
    @DisplayName("login: ném lỗi ACCOUNT_ERROR khi không tìm thấy username")
    void login_userNotFound_throwsException() {
        when(userApi.findUserAuthInfoByUsername("john")).thenReturn(Optional.empty());

        AuthException exception = assertThrows(AuthException.class, () -> authService.login(loginRequest));

        assertEquals(AuthErrorCode.ACCOUNT_ERROR.name(), exception.getCode());
        assertEquals(400, exception.getStatus());
        verify(authRepository, never()).save(any());
    }

    @Test
    @DisplayName("login: ném lỗi ACCOUNT_ERROR khi mật khẩu sai")
    void login_wrongPassword_throwsException() {
        when(userApi.findUserAuthInfoByUsername("john")).thenReturn(Optional.of(userAuthInfo));
        when(passwordEncoder.matches("password123", "hashed-secret")).thenReturn(false);

        AuthException exception = assertThrows(AuthException.class, () -> authService.login(loginRequest));

        assertEquals(AuthErrorCode.ACCOUNT_ERROR.name(), exception.getCode());
        assertEquals(400, exception.getStatus());
        verify(authRepository, never()).save(any());
    }

    // ==================== SIGNOUT ====================

    @Test
    @DisplayName("signout: xóa session theo token")
    void signout_success() {
        String token = "sample-refresh-token";

        authService.signout(token);

        verify(authRepository).deleteByToken(token);
    }

    // ==================== REFRESH ====================

    @Test
    @DisplayName("refresh: thành công khi session hợp lệ")
    void refresh_success() {
        String token = "valid-refresh-token";
        Session validSession = Session.create(userId, token, Duration.ofDays(7));

        when(authRepository.findByToken(token)).thenReturn(Optional.of(validSession));
        when(userApi.findUserAuthInfoById(userId)).thenReturn(Optional.of(userAuthInfo));
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("new-access-token");

        JwtResponse response = authService.refresh(token);

        assertNotNull(response);
        assertEquals("new-access-token", response.accessToken());
    }

    @Test
    @DisplayName("refresh: ném lỗi ACCESS_DENIED khi không tìm thấy session")
    void refresh_sessionNotFound_throwsException() {
        String token = "not-found-token";
        when(authRepository.findByToken(token)).thenReturn(Optional.empty());

        AuthException exception = assertThrows(AuthException.class, () -> authService.refresh(token));

        assertEquals(AuthErrorCode.ACCESS_DENIED.name(), exception.getCode());
        assertEquals(403, exception.getStatus());
    }

    @Test
    @DisplayName("refresh: ném lỗi ACCESS_DENIED khi session đã hết hạn")
    void refresh_sessionExpired_throwsException() {
        String token = "expired-token";
        Session expiredSession = new Session();
        expiredSession.setUserId(userId);
        expiredSession.setToken(token);
        expiredSession.setExpiresAt(Instant.now().minusSeconds(60));

        when(authRepository.findByToken(token)).thenReturn(Optional.of(expiredSession));

        AuthException exception = assertThrows(AuthException.class, () -> authService.refresh(token));

        assertEquals(AuthErrorCode.ACCESS_DENIED.name(), exception.getCode());
    }

    @Test
    @DisplayName("refresh: ném lỗi ACCESS_DENIED khi user trong session không còn tồn tại")
    void refresh_userNotFound_throwsException() {
        String token = "valid-token-deleted-user";
        Session validSession = Session.create(userId, token, Duration.ofDays(7));

        when(authRepository.findByToken(token)).thenReturn(Optional.of(validSession));
        when(userApi.findUserAuthInfoById(userId)).thenReturn(Optional.empty());

        AuthException exception = assertThrows(AuthException.class, () -> authService.refresh(token));

        assertEquals(AuthErrorCode.ACCESS_DENIED.name(), exception.getCode());
    }
}
