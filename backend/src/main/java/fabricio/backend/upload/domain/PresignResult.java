package fabricio.backend.upload.domain;

import fabricio.backend.shared.storage.PresignedUpload;

public record PresignResult(String key, PresignedUpload presignedUpload) {

}
