package fabricio.backend.upload.application;

import fabricio.backend.upload.domain.UploadPurpose;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class ObjectKeyFactory {
    private static final Map<String, String> EXT = Map.of(
            "image/png", ".png",
            "image/jpeg", "jpeg"
    );

    public String prefix(UUID ownerId, UploadPurpose purpose) {
        return purpose.ownerType().root() + "/" + ownerId + "/" + purpose.folder();
    }

    public String newKey(UUID ownerId, UploadPurpose purpose, String contentType) {
        return prefix(ownerId, purpose) + "/" + UUID.randomUUID() + EXT.getOrDefault(contentType, "");
    }
}
