package fabricio.backend.comment.web;

import fabricio.backend.comment.application.query.CommentQueryService;
import fabricio.backend.comment.application.query.dto.CommentView;
import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.base.CursorResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Comment query")
public class CommentQueryController {
    private final CommentQueryService commentQueryService;

    public CommentQueryController(CommentQueryService commentQueryService) {
        this.commentQueryService = commentQueryService;
    }

    @GetMapping("/games/{gameId}/comments")
    public ApiResponse<CursorResponse<CommentView>> getRootComments(
            @PathVariable UUID gameId,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "") String cursor
    ) {
        return ApiResponse.success(commentQueryService.getRootComments(gameId, size, cursor));
    }

    @GetMapping("/comments/{commentId}/replies")
    public ApiResponse<CursorResponse<CommentView>> getReplies(
            @PathVariable UUID commentId,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "") String cursor
    ) {
        return ApiResponse.success(commentQueryService.getReplies(commentId, size, cursor));
    }
}
