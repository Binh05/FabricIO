package fabricio.backend.upload.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.Duration;
import java.util.UUID;

public record PresignCommand(
        UploadPurpose purpose,
        @NotBlank String contentType,
        @Positive  long size
) { }