package fabricio.backend.users;

import java.util.UUID;

public record UserSummary(
        UUID id,
        String username,
        String email,
        String fullName,
        String hashedPassword
) {
}