package fabricio.backend.comment.web;

import fabricio.backend.comment.application.command.CommentCommandService;
import fabricio.backend.comment.application.command.dto.CreateCommentCommand;
import fabricio.backend.comment.application.dto.CreateCommentResult;
import fabricio.backend.comment.web.dto.CreateCommentRequest;
import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.security.UserPrincipal;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Comment command")
public class CommentCommandController {
    private final CommentCommandService commentCommandService;

    public CommentCommandController(CommentCommandService commentCommandService) {
        this.commentCommandService = commentCommandService;
    }

    @PostMapping("/games/{gameId}/comments")
    public ApiResponse<CreateCommentResult> createComment(
            @Valid @RequestBody CreateCommentRequest request,
            @PathVariable UUID gameId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(commentCommandService.createComment(
                new CreateCommentCommand(principal.getId(), gameId, null, request.content())
        ));
    }

    @PostMapping("/comments/{commentId}/replies")
    public ApiResponse<CreateCommentResult> createReply(
            @Valid @RequestBody CreateCommentRequest request,
            @PathVariable UUID commentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.success(commentCommandService.createComment(
                new CreateCommentCommand(principal.getId(), null, commentId, request.content())
        ));
    }
}
