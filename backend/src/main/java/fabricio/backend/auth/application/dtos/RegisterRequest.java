package fabricio.backend.auth.application.dtos;

public record RegisterRequest(String email, String username, String fullName, String password) {
    
}
