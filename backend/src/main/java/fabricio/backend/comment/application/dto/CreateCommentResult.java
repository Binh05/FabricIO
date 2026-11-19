package fabricio.backend.comment.application.dto;

import fabricio.backend.comment.domain.Comment;
import org.springframework.lang.Nullable;

import java.time.Instant;
import java.util.UUID;

public record CreateCommentResult(
        UUID id,
        UUID userId,
        UUID gameId,
        @Nullable
        UUID parentId,
        CommentAuthor author,
        String content,
        Instant updatedAt,
        Instant createdAt
) {
    public static CreateCommentResult fromComment(Comment c, CommentAuthor author) {
        return new CreateCommentResult(
                c.getId(),
                c.getUserId(),
                c.getGameId(),
                c.getParentId() == null ? null : c.getParentId(),
                author,
                c.getContent(),
                c.getUpdatedAt(),
                c.getCreatedAt()
        );
    }
}
