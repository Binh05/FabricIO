package fabricio.backend.comment.application.query.dto;

import fabricio.backend.comment.application.dto.CommentAuthor;
import fabricio.backend.comment.domain.Comment;

import java.time.Instant;
import java.util.UUID;

public record CommentView(
        UUID id,
        UUID parentId,
        CommentAuthor author,
        String content,
        int likeCount,
        int replyCount,
        Instant updatedAt,
        Instant createdAt
) {
    public static CommentView from(Comment comment, CommentAuthor author) {
        return new CommentView(
                comment.getId(),
                comment.getParentId(),
                author,
                comment.getContent(),
                comment.getLikeCount(),
                comment.getReplyCount(),
                comment.getUpdatedAt(),
                comment.getCreatedAt()
        );
    }
}
