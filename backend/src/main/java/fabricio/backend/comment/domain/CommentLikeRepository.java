package fabricio.backend.comment.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLikeId> {
    @Query("""
        SELECT l.id.commentId
        FROM CommentLike l
        WHERE l.id.userId = :userId
          AND l.id.commentId IN :commentIds
    """)
    List<UUID> findLikedCommentIds(
            @Param("userId") UUID userId,
            @Param("commentIds") List<UUID> commentIds
    );
}
