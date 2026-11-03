package fabricio.backend.upload.application.dtos;

import fabricio.backend.upload.domain.UploadPurpose;

import java.util.UUID;

public record CompleteCommand(UUID objectId, String key, UploadPurpose purpose) {
}
