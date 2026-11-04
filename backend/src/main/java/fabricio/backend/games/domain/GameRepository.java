package fabricio.backend.games.domain;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import fabricio.backend.games.domain.exception.GameErrorCode;
import fabricio.backend.games.domain.exception.GameException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {
    Page<Game> findByIsDeletedFalseAndTitleContainingIgnoreCaseAndStatus(String keyword, GameStatus status, Pageable pageable);
    Optional<Game> findByIdAndIsDeletedFalse(UUID id);
    boolean existsGameByIdAndOwnerIdAndIsDeletedFalse(UUID id, UUID ownerId);
    Optional<Game> findFirstByOwnerIdAndStatusAndIsDeletedFalse(UUID ownerId, GameStatus status);
    List<Game> findByOwnerIdAndIsDeletedFalseAndStatus(UUID ownerId, GameStatus status);
    void deleteGameById(UUID id);

    default Game findByIdOrThrow(UUID id) {
        return findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));
    }
    @Query("""
    SELECT DISTINCT g
    FROM Game g
    LEFT JOIN FETCH g.tags
    WHERE g.id IN :ids
""")
    List<Game> findAllWithTagsByIdIn(@Param("ids") Collection<UUID> ids);
}
