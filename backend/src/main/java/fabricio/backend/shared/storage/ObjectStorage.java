package fabricio.backend.shared.storage;

import java.io.InputStream;
import java.time.Duration;
import java.util.Optional;

public interface ObjectStorage {
    PresignedUpload presignUpload(String key, String contentType, long contentLength, Duration ttl);
    Optional<ObjectMeta> head(String key);
    InputStream get(String key);
    void put(String key, InputStream in, long length, String contentType);
    void delete(String key);
    String publicUrl(String key);
}