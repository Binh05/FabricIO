package fabricio.backend.upload.application;

import fabricio.backend.upload.domain.UploadPurpose;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class ObjectKeyFactory {
    // root/objectId/folder/uuid.content-type
    // users/id/avatars/uuid.png
    private static final Map<String, String> EXT = Map.of(
            "image/png", ".png",
            "image/jpeg", "jpeg"
    );

    public String prefix(UUID objectId, UploadPurpose purpose) {
        return purpose.ownerType().root() + "/" + objectId + "/" + purpose.folder();
    }

    public String newKey(UUID objectId, UploadPurpose purpose, String contentType) {
        return prefix(objectId, purpose) + "/" + UUID.randomUUID() + EXT.getOrDefault(contentType, "");
    }

    public boolean belongsTo(String key, UUID objectId, UploadPurpose purpose) {
        return key != null && key.startsWith(prefix(objectId, purpose)) && !key.contains("..");
    }
}
