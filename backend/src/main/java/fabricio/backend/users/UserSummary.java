package fabricio.backend.users;

import java.util.UUID;

public record UserSummary(UUID id, String email, String username, String fullname, String hashedPassword) {
    
}
