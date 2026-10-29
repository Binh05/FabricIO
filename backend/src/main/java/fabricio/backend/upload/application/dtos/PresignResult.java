package fabricio.backend.upload.application.dtos;

import fabricio.backend.shared.storage.PresignedUpload;

public record PresignResult(String key, PresignedUpload presignedUpload) {

}
