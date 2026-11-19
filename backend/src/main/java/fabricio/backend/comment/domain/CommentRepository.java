package fabricio.backend.comment.domain;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    @Modifying
    @Query("""
        UPDATE Comment c
        SET c.replyCount = c.replyCount + 1
        WHERE c.id = :parentId
    """)
    void incrementReplyCount(@Param("parentId") UUID parentID);

    @Query("""
        SELECT c FROM Comment c
        WHERE c.gameId = :game_id
        AND c.parentId IS NULL
        ORDER BY c.createdAt DESC, c.id DESC
    """)
    List<Comment> findFirstPage(@Param("game_id") UUID gameId, Pageable pageable);

    @Query("""
        SELECT c FROM Comment c
        WHERE c.gameId = :game_id
            AND (c.createdAt < :created_at
            OR (c.createdAt = :created_at AND c.id < :id))
        ORDER BY c.createdAt DESC, c.id DESC
    """)
    List<Comment> findNextPage(
            @Param("game_id") UUID gameId,
            @Param("created_at")Instant createdAt,
            @Param("id") UUID id,
            Pageable pageable
    );

    @Query("""
        SELECT c FROM Comment c
        WHERE c.parentId = :parent_id
        ORDER BY c.createdAt ASC, c.id ASC
    """)
    List<Comment> findReplies(
            @Param("parent_id") UUID parentId,
            Pageable pageable
    );

    @Query("""
        SELECT c FROM Comment c
        WHERE c.parentId = :parent_id
            AND (c.createdAt > :created_at
            OR (c.createdAt = :created_at AND c.id > :id))
        ORDER BY c.createdAt ASC, c.id ASC
    """)
    List<Comment> findNextReplies(
            @Param("parent_id") UUID parentId,
            @Param("created_at") Instant createdAt,
            @Param("id") UUID id,
            Pageable pageable
    );
}
