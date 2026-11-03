package fabricio.backend.auth.application.dtos;

public record LoginResult(String refreshToken, String accessToken) {
    
}
