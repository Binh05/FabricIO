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

import fabricio.backend.modules.auth.AuthRepository;
import fabricio.backend.modules.auth.AuthService;
import fabricio.backend.modules.auth.dtos.JwtResponse;
import fabricio.backend.modules.auth.dtos.LoginRequest;
import fabricio.backend.modules.auth.dtos.LoginResult;
import fabricio.backend.modules.auth.dtos.RegisterRequest;
import fabricio.backend.modules.auth.entities.Session;
import fabricio.backend.modules.auth.jwt.JwtTokenProvider;
import fabricio.backend.modules.users.RolePermissionRepository;
import fabricio.backend.modules.users.entities.User;
import fabricio.backend.modules.users.internal.IUserInternalService;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.enums.UserRole;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.mock.UserMockFactory;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private IUserInternalService userInternalService;

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