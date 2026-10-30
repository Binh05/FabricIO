package fabricio.backend.upload.application.handler;

import fabricio.backend.upload.domain.UploadPurpose;

import java.util.Set;
import java.util.UUID;

public interface UploadPurposeHandler {
    Set<UploadPurpose> purposes();
    void authorize(UUID userId, UUID objectId);
    String onComplete(UploadPurpose purpose, UUID userId, UUID objectId, String key);
}
