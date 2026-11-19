package fabricio.backend.comment.application.dto;

import fabricio.backend.comment.domain.Comment;

import java.time.Instant;
import java.util.UUID;

public record CommentRootDto(
        UUID id,
        CommentAuthor commentAuthor,
        String content,
        int likeCount,
        int replyCount,
        Instant updatedAt,
        Instant createdAt
) {
    public static CommentRootDto from(Comment c, CommentAuthor author) {
        return new CommentRootDto(
                c.getId(),
                author,
                c.getContent(),
                c.getLikeCount(),
                c.getReplyCount(),
                c.getUpdatedAt(),
                c.getCreatedAt()
        );
    }
}
