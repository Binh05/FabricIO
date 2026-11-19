package fabricio.backend.comment.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import fabricio.backend.comment.domain.Comment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateReplyRequest(
        @NotBlank(message = "Nội dung phản hồi không được để trống")
        @Size(max = Comment.MAX_CONTENT_LENGTH, message = "Nội dung phản hồi không được vượt quá 1024 ký tự")
        String content,
        @JsonProperty("parent_id")
        @NotNull(message = "parent_id không được để trống")
        UUID parentId
) {
    public CreateReplyRequest {
        if (content != null) {
            content = content.trim();
        }
    }
}
