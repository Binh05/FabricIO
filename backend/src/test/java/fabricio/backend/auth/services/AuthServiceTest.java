package fabricio.backend.modules.auth.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import fabricio.backend.auth.domain.AuthRepository;
import fabricio.backend.auth.application.AuthService;
import fabricio.backend.auth.application.dtos.JwtResponse;
import fabricio.backend.auth.application.dtos.LoginRequest;
import fabricio.backend.auth.application.dtos.LoginResult;
import fabricio.backend.auth.application.dtos.RegisterRequest;
import fabricio.backend.auth.domain.Session;
import fabricio.backend.shared.jwt.JwtTokenProvider;
import fabricio.backend.users.domain.RolePermissionRepository;
import fabricio.backend.users.domain.User;
import fabricio.backend.users.UserApi;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.enums.UserRole;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.mock.UserMockFactory;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserApi userInternalService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthRepository authRepository;

    @Mock
    private RolePermissionRepository rolePermissionRepository;

    @InjectMocks
    private AuthService authService;

    @Mock
    private HttpServletResponse httpServletResponse = mock(HttpServletResponse.class);

    @Test
    void register_shouldSuccess() {
        RegisterRequest request =
            new RegisterRequest(
                "john@gmail.com",
                "john",
                "John Doe",
                "123456"
            );

        when(userInternalService.exitsByEmail(request.email()))
            .thenReturn(false);

        when(userInternalService.existsByUsername(request.username()))
            .thenReturn(false);

        when(passwordEncoder.encode(request.password()))
            .thenReturn("hashed-password");

        String result = authService.register(request);

        assertEquals("Đăng ký thành công", result);

        verify(userInternalService)
            .createUserFromAuth(
                "john",
                "john@gmail.com",
                "John Doe",
                "hashed-password"
            );
    }

    @Test
    void register_shouldThrowWhenEmailExists() {

        RegisterRequest request =
            new RegisterRequest(
                "john@gmail.com",
                "john",
                "John Doe",
                "123456"
            );

        when(userInternalService.exitsByEmail(request.email()))
            .thenReturn(true);

        AppException ex =
            assertThrows(
                AppException.class,
                () -> authService.register(request)
            );

        assertEquals(
            ErrorCode.EMAIL_EXISTED,
            ex.getErrorCode()
        );
    }

    @Test
    void login_shouldSuccess() {
        User user = UserMockFactory.createMockUser();

        LoginRequest request =
            new LoginRequest(
                "john",
                "123456"
            );

        when(userInternalService.findByUsernameForAuth("john"))
            .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "123456",
                "hashed"))
            .thenReturn(true);

        when(tokenProvider.generateToken(any()))
            .thenReturn("access-token");

        when(rolePermissionRepository.findByRole(UserRole.User))
            .thenReturn(List.of());

        LoginResult result =
            authService.login(request);

        assertNotNull(result);

        assertEquals(
            "access-token",
            result.accessToken()
        );

        verify(authRepository)
            .save(any(Session.class));
    }

    @Test
    void login_shouldThrowWhenPasswordWrong() {
        User user = UserMockFactory.createMockUser();

        when(userInternalService.findByUsernameForAuth("john"))
            .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                "123456",
                "hashed"))
            .thenReturn(false);

        assertThrows(
            AppException.class,
            () -> authService.login(
                new LoginRequest(
                    "john",
                    "123456"
                )
            )
        );
    }

    @Test
    void refresh_shouldSuccess() {
        var user = UserMockFactory.createMockUser();
        Session session = new Session();

        session.setUser(user);
        session.setToken("refresh-token");
        session.setExpiresAt(
            Instant.now().plus(Duration.ofDays(1))
        );

        when(authRepository.findByToken("refresh-token"))
            .thenReturn(session);

        when(rolePermissionRepository.findByRole(UserRole.User))
            .thenReturn(List.of());

        when(tokenProvider.generateToken(any()))
            .thenReturn("new-access-token");

        JwtResponse response =
            authService.refresh("refresh-token", httpServletResponse);

        assertEquals(
            "new-access-token",
            response.accessToken()
        );
    }

    @Test
    void refresh_shouldThrowWhenSessionNotFound() {

        when(authRepository.findByToken("abc"))
            .thenReturn(null);

        assertThrows(
            AppException.class,
            () -> authService.refresh("abc", httpServletResponse)
        );
    }
}