package fabricio.backend.auth.web;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletResponse;

import fabricio.backend.auth.application.AuthService;
import fabricio.backend.auth.application.dtos.JwtResponse;
import fabricio.backend.auth.application.dtos.LoginRequest;
import fabricio.backend.auth.application.dtos.LoginResult;
import fabricio.backend.auth.application.dtos.RegisterRequest;
import fabricio.backend.auth.domain.exception.AuthErrorCode;
import fabricio.backend.auth.domain.exception.AuthException;
import fabricio.backend.shared.base.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private HttpServletResponse httpServletResponse;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("john@example.com", "john", "John Doe", "password123");
        loginRequest = new LoginRequest("john", "password123");
    }

    @Test
    @DisplayName("register: gọi authService.register và trả về status noContent")
    void register_success() {
        ApiResponse<Void> response = authController.register(registerRequest);

        verify(authService).register(registerRequest);
        assertNotNull(response);
    }

    @Test
    @DisplayName("login: thêm cookie refreshToken và trả về access token trong body")
    void login_success() {
        LoginResult loginResult = new LoginResult("refresh-secret-token", "access-jwt-token");
        when(authService.login(loginRequest)).thenReturn(loginResult);

        ApiResponse<JwtResponse> response = authController.login(loginRequest, httpServletResponse);

        assertNotNull(response);
        assertNotNull(response.getData());
        assertEquals("access-jwt-token", response.getData().accessToken());

        ArgumentCaptor<Cookie> cookieCaptor = ArgumentCaptor.forClass(Cookie.class);
        verify(httpServletResponse).addCookie(cookieCaptor.capture());
        Cookie cookie = cookieCaptor.getValue();
        assertEquals("refreshToken", cookie.getName());
        assertEquals("refresh-secret-token", cookie.getValue());
        assertTrue(cookie.isHttpOnly());
        assertEquals("/", cookie.getPath());
        assertEquals(7 * 24 * 60 * 60, cookie.getMaxAge());
    }

    @Test
    @DisplayName("signout: gọi authService.signout và xóa cookie refreshToken")
    void signout_success() {
        String token = "existing-token";

        ApiResponse<Void> response = authController.signout(token, httpServletResponse);

        verify(authService).signout(token);
        assertNotNull(response);

        ArgumentCaptor<Cookie> cookieCaptor = ArgumentCaptor.forClass(Cookie.class);
        verify(httpServletResponse).addCookie(cookieCaptor.capture());
        Cookie cookie = cookieCaptor.getValue();
        assertEquals("refreshToken", cookie.getName());
        assertEquals(0, cookie.getMaxAge());
    }

    @Test
    @DisplayName("refreshToken: thành công trả về access token mới")
    void refreshToken_success() {
        String refreshToken = "valid-refresh-token";
        when(authService.refresh(refreshToken)).thenReturn(new JwtResponse("new-access-token"));

        ApiResponse<JwtResponse> response = authController.refreshToken(refreshToken, httpServletResponse);

        assertNotNull(response);
        assertEquals("new-access-token", response.getData().accessToken());
    }

    @Test
    @DisplayName("refreshToken: ném AuthException khi refreshToken null hoặc rỗng")
    void refreshToken_nullOrBlank_throwsException() {
        AuthException ex1 = assertThrows(AuthException.class, () -> authController.refreshToken(null, httpServletResponse));
        assertEquals(AuthErrorCode.ACCESS_DENIED.name(), ex1.getCode());

        AuthException ex2 = assertThrows(AuthException.class, () -> authController.refreshToken("", httpServletResponse));
        assertEquals(AuthErrorCode.ACCESS_DENIED.name(), ex2.getCode());

        verify(authService, never()).refresh(any());
    }

    @Test
    @DisplayName("refreshToken: khi gặp AppException xóa cookie và re-throw exception")
    void refreshToken_appException_clearsCookieAndRethrows() {
        String refreshToken = "invalid-token";
        when(authService.refresh(refreshToken)).thenThrow(new AuthException(AuthErrorCode.ACCESS_DENIED));

        assertThrows(AuthException.class, () -> authController.refreshToken(refreshToken, httpServletResponse));

        ArgumentCaptor<Cookie> cookieCaptor = ArgumentCaptor.forClass(Cookie.class);
        verify(httpServletResponse).addCookie(cookieCaptor.capture());
        Cookie cookie = cookieCaptor.getValue();
        assertEquals("refreshToken", cookie.getName());
        assertEquals(0, cookie.getMaxAge());
    }
}
