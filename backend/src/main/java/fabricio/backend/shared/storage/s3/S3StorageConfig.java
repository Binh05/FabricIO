package fabricio.backend.shared.storage.s3;

import java.net.URI;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import fabricio.backend.shared.storage.StorageProperties;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
@EnableConfigurationProperties(StorageProperties.class)
public class S3StorageConfig {

    private static StaticCredentialsProvider credentials(StorageProperties p) {
        return StaticCredentialsProvider.create(AwsBasicCredentials.create(p.accessKey(), p.secretKey()));
    }

    private static S3Configuration s3Config(StorageProperties p) {
        return S3Configuration.builder().pathStyleAccessEnabled(p.pathStyle()).build();
    }

    private static boolean has(String s) {
        return s != null && !s.isBlank();
    }

    /** Backend -> storage (đi trong mạng nội bộ). */
    @Bean
    S3Client s3Client(StorageProperties p) {
        var b = S3Client.builder()
                .region(Region.of(p.region()))
                .credentialsProvider(credentials(p))
                .serviceConfiguration(s3Config(p));
        if (has(p.endpoint())) b.endpointOverride(URI.create(p.endpoint()));
        return b.build();
    }

    /** Ký URL cho trình duyệt: phải dùng public endpoint vì host nằm trong chữ ký. */
    @Bean
    S3Presigner s3Presigner(StorageProperties p) {
        var b = S3Presigner.builder()
                .region(Region.of(p.region()))
                .credentialsProvider(credentials(p))
                .serviceConfiguration(s3Config(p));
        if (has(p.publicEndpoint())) b.endpointOverride(URI.create(p.publicEndpoint()));
        return b.build();
    }
}