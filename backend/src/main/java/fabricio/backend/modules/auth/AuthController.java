package fabricio.backend.modules.auth;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fabricio.backend.modules.auth.dtos.JwtResponse;
import fabricio.backend.modules.auth.dtos.LoginRequest;
import fabricio.backend.modules.auth.dtos.RegisterRequest;
import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.exceptions.ForbiddenException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
public class AuthController {
    private final IAuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        return authService.register(req);
    }
    
    @PostMapping("/login")
    public ApiResponse<JwtResponse> login(@RequestBody LoginRequest req, HttpServletResponse response) {
        var jwt = authService.login(req);

        Cookie cookie = new Cookie("refreshToken", jwt.refreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 *60);

        response.addCookie(cookie);

        return ApiResponse.success(new JwtResponse(jwt.accessToken()));
    }

    @PostMapping("/signout")
    public ApiResponse<Void> signout(@CookieValue(name = "refreshToken", required = false) String token, HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);

        authService.signout(token);

        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        return ApiResponse.noContent();
    }

    @PostMapping("/refresh")
    public ApiResponse<JwtResponse> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new ForbiddenException("Không có quyền");
        }
        var accessToken = authService.refresh(refreshToken);

        return ApiResponse.success(accessToken);
    }
}
