package fabricio.backend.comment.web.dto;

import jakarta.validation.constraints.NotNull;

public record SetCommentLikeRequest(
        @NotNull Boolean liked
) {
}
