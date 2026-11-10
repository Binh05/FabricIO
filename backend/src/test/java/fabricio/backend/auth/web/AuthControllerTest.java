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

import fabricio.backend.auth.application.AuthService;
import fabricio.backend.auth.application.dtos.JwtResponse;
import fabricio.backend.auth.application.dtos.LoginRequest;
import fabricio.backend.auth.application.dtos.LoginResult;
import fabricio.backend.auth.application.dtos.RegisterRequest;
import fabricio.backend.auth.domain.exception.AuthErrorCode;
import fabricio.backend.auth.domain.exception.AuthException;
import fabricio.backend.shared.base.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;

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
    @DisplayName("login: thêm header Set-Cookie với SameSite=None, Secure và trả về access token")
    void login_success() {
        LoginResult loginResult = new LoginResult("refresh-secret-token", "access-jwt-token");
        when(authService.login(loginRequest)).thenReturn(loginResult);

        ApiResponse<JwtResponse> response = authController.login(loginRequest, httpServletResponse);

        assertNotNull(response);
        assertNotNull(response.getData());
        assertEquals("access-jwt-token", response.getData().accessToken());

        ArgumentCaptor<String> headerNameCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> headerValueCaptor = ArgumentCaptor.forClass(String.class);

        verify(httpServletResponse).addHeader(headerNameCaptor.capture(), headerValueCaptor.capture());

        assertEquals(HttpHeaders.SET_COOKIE, headerNameCaptor.getValue());
        String cookieHeader = headerValueCaptor.getValue();

        assertTrue(cookieHeader.contains("refreshToken=refresh-secret-token"));
        assertTrue(cookieHeader.contains("HttpOnly"));
        assertTrue(cookieHeader.contains("Secure"));
        assertTrue(cookieHeader.contains("SameSite=None"));
        assertTrue(cookieHeader.contains("Path=/"));
        assertTrue(cookieHeader.contains("Max-Age=604800")); // 7 * 24 * 60 * 60 seconds
    }

    @Test
    @DisplayName("signout: gọi authService.signout và xóa cookie refreshToken (Max-Age=0)")
    void signout_success() {
        String token = "existing-token";

        ApiResponse<Void> response = authController.signout(token, httpServletResponse);

        verify(authService).signout(token);
        assertNotNull(response);

        ArgumentCaptor<String> headerNameCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> headerValueCaptor = ArgumentCaptor.forClass(String.class);

        verify(httpServletResponse).addHeader(headerNameCaptor.capture(), headerValueCaptor.capture());

        assertEquals(HttpHeaders.SET_COOKIE, headerNameCaptor.getValue());
        String cookieHeader = headerValueCaptor.getValue();

        assertTrue(cookieHeader.contains("refreshToken="));
        assertTrue(cookieHeader.contains("Max-Age=0"));
        assertTrue(cookieHeader.contains("SameSite=None"));
        assertTrue(cookieHeader.contains("Secure"));
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

        ArgumentCaptor<String> headerNameCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> headerValueCaptor = ArgumentCaptor.forClass(String.class);

        verify(httpServletResponse).addHeader(headerNameCaptor.capture(), headerValueCaptor.capture());

        assertEquals(HttpHeaders.SET_COOKIE, headerNameCaptor.getValue());
        String cookieHeader = headerValueCaptor.getValue();

        assertTrue(cookieHeader.contains("refreshToken="));
        assertTrue(cookieHeader.contains("Max-Age=0"));
        assertTrue(cookieHeader.contains("SameSite=None"));
        assertTrue(cookieHeader.contains("Secure"));
    }
}