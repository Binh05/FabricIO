package fabricio.backend.auth.web;

import fabricio.backend.auth.application.AuthService;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fabricio.backend.auth.application.dtos.JwtResponse;
import fabricio.backend.auth.application.dtos.LoginRequest;
import fabricio.backend.auth.application.dtos.RegisterRequest;
import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
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

        Cookie cookie = new Cookie("refreshToken", jwt.refreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7* 24 * 60 *60);

        response.addCookie(cookie);

        return ApiResponse.success(new JwtResponse(jwt.accessToken()));
    }

    @PostMapping("/signout")
    public ApiResponse<Void> signout(
            @CookieValue(name = "refreshToken", required = false) String token,
            HttpServletResponse response
    ) {
        Cookie cookie = new Cookie("refreshToken", null);

        authService.signout(token);

        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        return ApiResponse.noContent();
    }

    @PostMapping("/refresh")
    public ApiResponse<JwtResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
        try {
            return ApiResponse.success(authService.refresh(refreshToken));
        }
        catch (AppException e) {
            Cookie cookie = new Cookie("refreshToken", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
            throw e;
        }
    }
}
