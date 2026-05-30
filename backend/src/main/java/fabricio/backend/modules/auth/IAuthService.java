package fabricio.backend.modules.auth;

import fabricio.backend.modules.auth.dtos.JwtResponse;
import fabricio.backend.modules.auth.dtos.LoginRequest;
import fabricio.backend.modules.auth.dtos.LoginResult;
import fabricio.backend.modules.auth.dtos.RegisterRequest;

public interface IAuthService {
    public String register(RegisterRequest req);
    public LoginResult login(LoginRequest req);
    public void signout(String token);
    public JwtResponse refresh(String token);
}
