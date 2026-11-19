package fabricio.backend.comment.web.dto;

import fabricio.backend.comment.domain.Comment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommentRequest(
        @NotBlank(message = "Nội dung bình luận không được để trống")
        @Size(max = Comment.MAX_CONTENT_LENGTH, message = "Nội dung bình luận không được vượt quá 1024 ký tự")
        String content
) {
    public CreateCommentRequest {
        if (content != null) {
            content = content.trim();
        }
    }
}
