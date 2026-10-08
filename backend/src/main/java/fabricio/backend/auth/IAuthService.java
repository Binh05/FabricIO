package fabricio.backend.auth;

import fabricio.backend.auth.dtos.JwtResponse;
import fabricio.backend.auth.dtos.LoginRequest;
import fabricio.backend.auth.dtos.LoginResult;
import fabricio.backend.auth.dtos.RegisterRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface IAuthService {
    public String register(RegisterRequest req);
    public LoginResult login(LoginRequest req);
    public void signout(String token);
    public JwtResponse refresh(String token, HttpServletResponse response);
}
