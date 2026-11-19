package fabricio.backend.comment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment {

    public static final int MAX_CONTENT_LENGTH = 1024;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @Column(name = "game_id", nullable = false, updatable = false)
    private UUID gameId;

    @Column(name = "parent_id", updatable = false)
    private UUID parentId;

    @Column(name = "reply_to_comment_id", updatable = false)
    private UUID replyToCommentId;

    @Column(name = "content", length = MAX_CONTENT_LENGTH, nullable = false)
    private String content;

    @Column(name = "like_count", nullable = false)
    private int likeCount;

    @Column(name = "reply_count", nullable = false)
    private int replyCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    private Comment(UUID userId, UUID gameId, UUID parentId, UUID replyToCommentId, String content) {
        this.userId = Objects.requireNonNull(userId, "userId must not be null");
        this.gameId = Objects.requireNonNull(gameId, "gameId must not be null");
        this.parentId = parentId;
        this.replyToCommentId = replyToCommentId;
        this.content = validateAndNormalizeContent(content);
        this.likeCount = 0;
        this.replyCount = 0;
    }

    public static Comment createRoot(UUID userId, UUID gameId, String content) {
        return new Comment(userId, gameId, null, null, content);
    }

    public static Comment createReply(
            UUID userId,
            UUID gameId,
            UUID parentId,
            UUID replyToCommentId,
            String content
    ) {
        Objects.requireNonNull(parentId, "parentId must not be null for a reply");
        Objects.requireNonNull(replyToCommentId, "replyToCommentId must not be null for a reply");
        return new Comment(userId, gameId, parentId, replyToCommentId, content);
    }

    public void editContent(String newContent) {
        this.content = validateAndNormalizeContent(newContent);
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }

    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }

    public void incrementReplyCount() {
        this.replyCount++;
    }

    public void decrementReplyCount() {
        if (this.replyCount > 0) {
            this.replyCount--;
        }
    }

    public boolean isRoot() {
        return this.parentId == null;
    }

    public boolean isOwnedBy(UUID actorId) {
        return this.userId.equals(actorId);
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    private static String validateAndNormalizeContent(String rawContent) {
        if (rawContent == null || rawContent.isBlank()) {
            throw new IllegalArgumentException("Comment content must not be blank");
        }
        String trimmed = rawContent.trim();
        if (trimmed.length() > MAX_CONTENT_LENGTH) {
            throw new IllegalArgumentException(
                    "Comment content exceeds maximum length of " + MAX_CONTENT_LENGTH + " characters"
            );
        }
        return trimmed;
    }
}