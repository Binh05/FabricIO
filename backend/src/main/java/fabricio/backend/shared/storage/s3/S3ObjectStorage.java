package fabricio.backend.shared.storage.s3;

import java.io.InputStream;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Component;

import fabricio.backend.shared.storage.ObjectMeta;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.shared.storage.PresignedUpload;
import fabricio.backend.shared.storage.StorageProperties;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

/** ADAPTER duy nhất: chạy được với S3 thật, MinIO, Garage, SeaweedFS... chỉ khác cấu hình. */
@Component
public class S3ObjectStorage implements ObjectStorage {

    private final S3Client s3;
    private final S3Presigner presigner;
    private final StorageProperties props;

    public S3ObjectStorage(S3Client s3, S3Presigner presigner, StorageProperties props) {
        this.s3 = s3;
        this.presigner = presigner;
        this.props = props;
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
    }

    @Override
    public void delete(String key) {
        s3.deleteObject(b -> b.bucket(props.bucket()).key(key));
    }

    @Override
    public String publicUrl(String key) {
        String base = props.publicEndpoint();
        return props.pathStyle()
                ? base + "/" + props.bucket() + "/" + key
                : base + "/" + key; // S3 thật: base là domain bucket hoặc CDN
    }
}