package fabricio.backend.modules.auth.dtos;

public record JwtResponse(String refreshToken, String accessToken) {
    
}
