package fabricio.backend.shared.storage;

public record ObjectMeta(
        long size,
        String contentType,
        String etag
) {};