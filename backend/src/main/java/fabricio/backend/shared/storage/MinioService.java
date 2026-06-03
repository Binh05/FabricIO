package fabricio.backend.shared.storage;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
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

    @Value("${minio.bucket}")
    private String bucket;

    @Value("${minio.url}")
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
    public String attractAndUploadFile(MultipartFile zipFile) {
        try (ZipInputStream zipInputStream = new ZipInputStream(zipFile.getInputStream())) {
            ZipEntry entry;
            while((entry = zipInputStream.getNextEntry()) != null) {
                if (entry.isDirectory()) {
                    zipInputStream.closeEntry();
                    continue;
                }

                String fileName = entry.getName();

                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int len;
                while((len = zipInputStream.read(buffer)) > 0) {
                    byteArrayOutputStream.write(buffer, 0, len);
                }
                byte[] fileBytes = byteArrayOutputStream.toByteArray();

                String contentType = getContentType(fileName);

                try (InputStream entryInputStream = new ByteArrayInputStream(fileBytes)) {
                    minioClient.putObject(
                        PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .stream(entryInputStream, fileBytes.length, -1)
                            .contentType(contentType)
                            .build()
                    );
                }
                catch (Exception e) 
                {
                    throw new AppException(ErrorCode.FAILED_UPLOAD_FILE, e);
                }

                zipInputStream.closeEntry();
            }

            return bucket;
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
        
        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();

        return switch (extension) {
            case ".html", ".htm" -> "text/html";
            case ".js"          -> "application/javascript";
            case ".wasm"        -> "application/wasm";
            case ".css"         -> "text/css";
            case ".json"        -> "application/json";
            case ".data"        -> "application/octet-stream";

            case ".br"          -> "application/x-brotli";
            case ".gz"          -> "application/gzip";     
            default             -> "application/octet-stream";
        };
    }

    public String getFullUrl(String objectName) {
        return storageUrl + "/" + bucket + "/" + objectName;
    }
}
