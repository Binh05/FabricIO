package fabricio.backend.shared.storage;

import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

public interface IStorageService {
    String uploadFile(String objectName, MultipartFile file);
    InputStream getFile(String objectName);
    void deleteFile(String objectName);
    String attractAndUploadFile(MultipartFile zipFile);
    String getFullUrl(String objectName);
}
