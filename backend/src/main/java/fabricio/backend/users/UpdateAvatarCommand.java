package fabricio.backend.users;

import java.util.UUID;

public record UpdateAvatarCommand(UUID userId, String key) {
}
