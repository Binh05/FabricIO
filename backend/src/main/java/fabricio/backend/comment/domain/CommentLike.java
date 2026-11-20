package fabricio.backend.comment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "comment_likes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommentLike {
    @EmbeddedId
    private CommentLikeId id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public CommentLike(UUID commentId, UUID userId) {
        this.id = new CommentLikeId(commentId, userId);
    }

    public CommentLike(CommentLikeId id) {
        this.id = id;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
