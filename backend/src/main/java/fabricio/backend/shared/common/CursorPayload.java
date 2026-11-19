package fabricio.backend.shared.common;

import java.time.Instant;
import java.util.UUID;

public record CursorPayload(Instant createdAt, UUID id) {
}
