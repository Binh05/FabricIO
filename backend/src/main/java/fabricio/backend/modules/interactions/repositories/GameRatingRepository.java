package fabricio.backend.modules.interactions.repositories;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import fabricio.backend.modules.interactions.entities.GameRating;

@Repository
public interface GameRatingRepository extends JpaRepository<GameRating, UUID> {
    Optional<GameRating> findByGameIdAndUserId(UUID gameId, UUID userId);
    Page<GameRating> findByGameId(UUID gameId, Pageable pageable);
}
