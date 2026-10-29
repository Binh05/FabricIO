package fabricio.backend.upload;

import java.util.UUID;

public record UpdateAvatarCommand(UUID userId, String key) {
}
