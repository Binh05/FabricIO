package fabricio.backend.upload.web;

import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.security.UserPrincipal;
import fabricio.backend.upload.application.UploadService;
import fabricio.backend.upload.application.dtos.CompleteCommand;
import fabricio.backend.upload.application.dtos.CompleteResult;
import fabricio.backend.upload.application.dtos.PresignCommand;
import fabricio.backend.upload.application.dtos.PresignResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/uploads")
@Tag(name = "Upload", description = "Presign Url and confirm upload")
public class UploadController {
    private final UploadService uploads;

    public UploadController(UploadService uploads) {
        this.uploads = uploads;
    }

    @PostMapping("/presign")
    public ApiResponse<PresignResult> presign(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PresignCommand cmd)
    {
        return ApiResponse.success(uploads.presign(principal.getId(), cmd));
    }

    @PostMapping("/complete")
    public ApiResponse<CompleteResult> complete(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CompleteCommand cmd
    ) {
        return ApiResponse.success(uploads.complete(principal.getId(), cmd));
    }
}