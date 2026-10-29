package fabricio.backend.upload.application;

import fabricio.backend.upload.application.dtos.CompleteResult;
import fabricio.backend.upload.domain.UploadPurpose;

import java.util.Set;
import java.util.UUID;

public interface UploadPurposeHandler {
    Set<UploadPurpose> purposes();
    String onComplete(UUID userId, String key);
}
