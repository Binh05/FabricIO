package fabricio.backend.shared.storage;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3Service implements IStorageService {

    private final S3Client s3Client;

    @Value("${storage.bucket}")
    private String bucket;

    @Value("${storage.domain}")
    private String storageUrl;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadFile(String objectName, MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
            return "/" + objectName;
        } catch (Exception e) {
            throw new AppException(ErrorCode.FAILED_UPLOAD_FILE, e);
        }
    }

    @Override
    public InputStream getFile(String objectName) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectName)
                    .build();
            
            return s3Client.getObject(getObjectRequest);
        } catch (Exception e) {
            throw new AppException(ErrorCode.FAILED_GET_FILE, e);
        }
    }

    @Override
    public void deleteFile(String objectName) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectName)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            throw new AppException(ErrorCode.FAILED_DELETE_FILE, e);
        }
    }

    @Override
    public String extractAndUploadFile(String objectName, MultipartFile zipFile) {
        try (ZipInputStream zipInputStream = new ZipInputStream(zipFile.getInputStream())) {
            ZipEntry entry;
            while ((entry = zipInputStream.getNextEntry()) != null) {
                if (entry.isDirectory()) {
                    zipInputStream.closeEntry();
                    continue;
                }

                String fileName = entry.getName();
                int firstIndex = fileName.indexOf("/");
                if (firstIndex != -1) {
                    fileName = fileName.substring(firstIndex + 1);
                }

                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int len;
                while ((len = zipInputStream.read(buffer)) > 0) {
                    byteArrayOutputStream.write(buffer, 0, len);
                }
                byte[] fileBytes = byteArrayOutputStream.toByteArray();

                String contentType = getContentType(fileName);
                String contentEncoding = getContentEncoding(fileName);
                String entryPath = objectName.endsWith("/") ? objectName + fileName : objectName + "/" + fileName;

                try {
                    PutObjectRequest.Builder builder = PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(entryPath)
                            .contentType(contentType);

                    // Cấu hình Content-Encoding (cho file .br hoặc .gz của DevTool Fabric)
                    if (contentEncoding != null) {
                        builder.contentEncoding(contentEncoding);
                    }

                    s3Client.putObject(builder.build(), RequestBody.fromBytes(fileBytes));
                } catch (Exception e) {
                    throw new AppException(ErrorCode.FAILED_UPLOAD_FILE, e);
                }

                zipInputStream.closeEntry();
            }

            return "/" + objectName;
        } catch (Exception e) {
            throw new AppException(ErrorCode.FAILED_UPLOAD_FILE, e);
        }
    }

    public String getContentType(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "application/octet-stream";
        }

        String cleanFilename = filename;
        if (filename.endsWith(".br") || filename.endsWith(".gz")) {
            cleanFilename = filename.substring(0, filename.lastIndexOf("."));
        }

        if (!cleanFilename.contains(".")) {
            return "application/octet-stream";
        }

        String extension = cleanFilename.substring(cleanFilename.lastIndexOf(".")).toLowerCase();

        return switch (extension) {
            case ".html", ".htm" -> "text/html";
            case ".js"           -> "application/javascript";
            case ".wasm"         -> "application/wasm";
            case ".css"          -> "text/css";
            case ".json"         -> "application/json";
            default              -> "application/octet-stream";
        };
    }

    public String getContentEncoding(String filename) {
        if (filename != null) {
            if (filename.endsWith(".br")) return "br";
            if (filename.endsWith(".gz")) return "gzip";
        }
        return null;
    }

    public String getFullUrl(String objectName) {
        return objectName.startsWith("/") ? storageUrl + objectName : storageUrl + "/" + objectName;
    }
}