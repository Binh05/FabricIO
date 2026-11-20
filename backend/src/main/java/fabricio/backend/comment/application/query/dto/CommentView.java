package fabricio.backend.comment.application.query.dto;

import fabricio.backend.comment.domain.Comment;

import java.time.Instant;
import java.util.UUID;

public record CommentView(
        UUID id,
        UUID parentId,
        UUID replyToCommentId,
        CommentAuthor author,
        String content,
        int likeCount,
        boolean likedByMe,
        int replyCount,
        Instant updatedAt,
        Instant createdAt
) {
    public static CommentView from(Comment comment, CommentAuthor author, boolean likedByMe) {
        return new CommentView(
                comment.getId(),
                comment.getParentId(),
                comment.getReplyToCommentId(),
                author,
                comment.getContent(),
                comment.getLikeCount(),
                likedByMe,
                comment.getReplyCount(),
                comment.getUpdatedAt(),
                comment.getCreatedAt()
        );
    }
}
