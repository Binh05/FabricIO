package fabricio.backend.shared.storage;

import java.time.Instant;
import java.util.Map;

public record PresignedUpload(
        String url,
        String method,
        Map<String, String> headers,
        Instant expiresAt
) {};