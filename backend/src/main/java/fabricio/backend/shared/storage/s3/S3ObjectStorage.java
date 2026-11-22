package fabricio.backend.shared.storage.s3;

import java.io.InputStream;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import fabricio.backend.shared.storage.ObjectMeta;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.shared.storage.PresignedUpload;
import fabricio.backend.shared.storage.R2UsageTracker;
import fabricio.backend.shared.storage.StorageProperties;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

/** ADAPTER duy nhất: chạy được với S3 thật, MinIO, Garage, SeaweedFS... chỉ khác cấu hình. */
@Component
public class S3ObjectStorage implements ObjectStorage {

    private final S3Client s3;
    private final S3Presigner presigner;
    private final StorageProperties props;
    private final R2UsageTracker usage;

    public S3ObjectStorage(S3Client s3, S3Presigner presigner, StorageProperties props, R2UsageTracker usage) {
        this.s3 = s3;
        this.presigner = presigner;
        this.props = props;
        this.usage = usage;
    }

    @PostConstruct
    void initializeUsage() {
        usage.reset();
        try {
            s3.listObjectsV2Paginator(ListObjectsV2Request.builder().bucket(props.bucket()).build())
                    .forEach(page -> page.contents().forEach(object ->
                            usage.initialize(object.key(), object.size())));
        } catch (S3Exception e) {
            throw new IllegalStateException("Could not initialize R2 usage from bucket " + props.bucket(), e);
        }
    }

    @Override
    public PresignedUpload presignUpload(String key, String contentType, long contentLength, Duration ttl) {
        PutObjectRequest put = PutObjectRequest.builder()
                .bucket(props.bucket())
                .key(key)
                .contentType(contentType)
                .contentLength(contentLength) // bị ký vào URL: client nói dối dung lượng thì PUT thất bại
                .build();

        PresignedPutObjectRequest signed = presigner.presignPutObject(r -> r
                .signatureDuration(ttl)
                .putObjectRequest(put));

        // Chỉ trả header client được phép tự đặt. Host và Content-Length do trình duyệt tự gắn.
        Map<String, String> headers = new LinkedHashMap<>();
        signed.signedHeaders().forEach((name, values) -> {
            String n = name.toLowerCase();
            if (!n.equals("host") && !n.equals("content-length")) {
                headers.put(name, String.join(",", values));
            }
        });

        return new PresignedUpload(signed.url().toString(), "PUT", headers, signed.expiration());
    }

    @Override
    public Optional<ObjectMeta> head(String key) {
        try {
            var r = s3.headObject(b -> b.bucket(props.bucket()).key(key));
            return Optional.of(new ObjectMeta(r.contentLength(), r.contentType(), r.eTag()));
        } catch (S3Exception e) {
            if (e.statusCode() == 404) return Optional.empty();
            throw e;
        }
    }

    @Override
    public InputStream get(String key) {
        return s3.getObject(b -> b.bucket(props.bucket()).key(key));
    }

    @Override
    public void put(String key, InputStream in, long length, String contentType) {
        s3.putObject(
                b -> b.bucket(props.bucket()).key(key).contentType(contentType).contentLength(length),
                RequestBody.fromInputStream(in, length));
        usage.registerObject(key, length);
    }

    @Override
    public void delete(String key) {
        Optional<ObjectMeta> meta = head(key);
        s3.deleteObject(b -> b.bucket(props.bucket()).key(key));
        meta.ifPresent(m -> usage.removeObject(key));
    }

    @Override
    public void registerObject(String key, long size) {
        usage.registerObject(key, size);
    }

    @Override
    public void confirmObject(String key, long size) {
        usage.confirmObject(key, size);
    }

    @Override
    public String publicUrl(String key) {
        if (key == null || key.isBlank()) return key;

        if (key.startsWith("http")) return key;
        if (key.startsWith("/")) key = key.substring(1);

        String base = props.publicEndpoint();
        return props.pathStyle()
                ? base + "/" + props.bucket() + "/" + key
                : base + "/" + key; // S3 thật: base là domain bucket hoặc CDN
    }

    @Override
    public String publicUrl(String key, String addPath) {
        String baseUrl = publicUrl(key);
        if (baseUrl == null || baseUrl.isBlank()) return baseUrl;
        if (addPath == null || addPath.isBlank()) return baseUrl;

        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        if (addPath.startsWith("/")) {
            addPath = addPath.substring(1);
        }

        return baseUrl + "/" + addPath;
    }
}