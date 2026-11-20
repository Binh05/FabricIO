package fabricio.backend.comment.application.command.dto;

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
        @Nullable
        UUID replyToCommentId,
        CommentAuthor author,
        String content,
        int likeCount,
        boolean likedByMe,
        int replyCount,
        Instant updatedAt,
        Instant createdAt
) {
    public static CreateCommentResult fromComment(Comment c, CommentAuthor author) {
        return new CreateCommentResult(
                c.getId(),
                c.getUserId(),
                c.getGameId(),
                c.getParentId(),
                c.getReplyToCommentId(),
                author,
                c.getContent(),
                c.getLikeCount(),
                false,
                c.getReplyCount(),
                c.getUpdatedAt(),
                c.getCreatedAt()
        );
    }
}
