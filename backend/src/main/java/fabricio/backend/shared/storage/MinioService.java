package fabricio.backend.shared.storage;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;

@Service
public class MinioService implements IStorageService {
    private final MinioClient minioClient;

    @Value("${storage.bucket}")
    private String bucket;

    @Value("${storage.url}")
    private String storageUrl;

    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String uploadFile(String objectName, MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .stream(inputStream, file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
            );
            return "/" + objectName;
        }
        catch (Exception e) {
            throw new AppException(ErrorCode.FAILED_UPLOAD_FILE, e);
        }
    }

    @Override
    public InputStream getFile(String objectName) {
        try {
            return minioClient.getObject(
                GetObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build()
        );
        } catch (Exception e) {
            throw new AppException(ErrorCode.FAILED_GET_FILE, e);
        }
    }

    @Override
    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build()
            );
        } catch (Exception e) {
            throw new AppException(ErrorCode.FAILED_DELETE_FILE, e);
        }
    }

    @Override
    public String extractAndUploadFile(String objectName, MultipartFile zipFile) {
        try (ZipInputStream zipInputStream = new ZipInputStream(zipFile.getInputStream())) {
            ZipEntry entry;
            while((entry = zipInputStream.getNextEntry()) != null) {
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
                while((len = zipInputStream.read(buffer)) > 0) {
                    byteArrayOutputStream.write(buffer, 0, len);
                }
                byte[] fileBytes = byteArrayOutputStream.toByteArray();

                String contentType = getContentType(fileName);
                String contentEncoding = getContentEncoding(fileName);

                String entryPath = objectName.endsWith("/") ? objectName + fileName : objectName + "/" + fileName;

                try (InputStream entryInputStream = new ByteArrayInputStream(fileBytes)) {
                    var builder = PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(entryPath)
                            .stream(entryInputStream, fileBytes.length, -1)
                            .contentType(contentType);

                    // Nếu là file nén (.br hoặc .gz), cấu hình Content-Encoding vào metadata
                    if (contentEncoding != null) {
                        builder.headers(Map.of("Content-Encoding", contentEncoding));
                    }

                    minioClient.putObject(builder.build());
                }
                catch (Exception e) 
                {
                    throw new AppException(ErrorCode.FAILED_UPLOAD_FILE, e);
                }

                zipInputStream.closeEntry();
            }

            return "/" + objectName;
        }
        catch (Exception e)
        {
            throw new AppException(ErrorCode.FAILED_UPLOAD_FILE, e);
        }
    }

    public String getContentType(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "application/octet-stream";
        }
        
        // Loại bỏ đuôi nén .br hoặc .gz nếu có để lấy đuôi file gốc (e.g., .js.br -> .js)
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
            case ".js"          -> "application/javascript";
            case ".wasm"        -> "application/wasm";
            case ".css"         -> "text/css";
            case ".json"        -> "application/json";
            case ".data"        -> "application/octet-stream";
            default             -> "application/octet-stream";
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
