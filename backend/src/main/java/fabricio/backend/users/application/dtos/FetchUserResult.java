package fabricio.backend.users.application.dtos;

import java.time.Instant;
import java.util.UUID;

public record FetchUserResult(
        UUID id,
        String username,
        String fullName,
        String bio,
        String avatarUrl,
        Instant createdAt
) {
}
