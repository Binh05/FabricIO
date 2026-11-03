package fabricio.backend.shared.storage;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * application.yml (local, MinIO):
 *   app.storage:
 *     endpoint: http://minio:9000            # backend gọi (tên service trong docker network)
 *     public-endpoint: http://localhost:9000 # trình duyệt gọi; presigner ký bằng host này
 *     bucket: fabricio-dev
 *     path-style: true
 *     access-key: ...
 *     secret-key: ...
 *
 * Production (AWS S3): bỏ endpoint, path-style=false,
 * public-endpoint = domain bucket hoặc CDN (dùng cho publicUrl).
 */
@ConfigurationProperties(prefix = "app.storage")
public record StorageProperties(
        String endpoint,
        String publicEndpoint,
        String region,
        String bucket,
        String accessKey,
        String secretKey,
        boolean pathStyle,
        Duration presignTtl) {

    public StorageProperties {
        if (region == null || region.isBlank()) region = "us-east-1";
        if (presignTtl == null) presignTtl = Duration.ofMinutes(10);
        if (publicEndpoint == null || publicEndpoint.isBlank()) publicEndpoint = endpoint;
    }
}