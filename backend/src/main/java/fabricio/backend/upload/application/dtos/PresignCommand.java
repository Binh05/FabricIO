package fabricio.backend.upload.application.dtos;

import fabricio.backend.upload.domain.UploadPurpose;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record PresignCommand(
        UUID objectId,
        UploadPurpose purpose,
        @NotBlank String contentType,
        @Positive  long size
) { }