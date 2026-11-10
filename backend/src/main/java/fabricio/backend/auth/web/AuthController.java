package fabricio.backend.auth.web;

import fabricio.backend.auth.application.AuthService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fabricio.backend.auth.application.dtos.JwtResponse;
import fabricio.backend.auth.application.dtos.LoginRequest;
import fabricio.backend.auth.application.dtos.RegisterRequest;
import fabricio.backend.auth.domain.exception.AuthErrorCode;
import fabricio.backend.auth.domain.exception.AuthException;
import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.exceptions.AppException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<Void> register(@RequestBody RegisterRequest req) {
        authService.register(req);
        return ApiResponse.noContent();
    }
    
    @PostMapping("/login")
    public ApiResponse<JwtResponse> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        var jwt = authService.login(req);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", jwt.refreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(7* 24 * 60 *60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ApiResponse.success(new JwtResponse(jwt.accessToken()));
    }

    @PostMapping("/signout")
    public ApiResponse<Void> signout(
            @CookieValue(name = "refreshToken", required = false) String token,
            HttpServletResponse response
    ) {
        authService.signout(token);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ApiResponse.noContent();
    }

    @PostMapping("/refresh")
    public ApiResponse<JwtResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new AuthException(AuthErrorCode.ACCESS_DENIED);
        }
        try {
            return ApiResponse.success(authService.refresh(refreshToken));
        }
        catch (AppException e) {
            ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            throw e;
        }
    }
}
