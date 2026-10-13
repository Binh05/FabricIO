package fabricio.backend.games.domain;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameFavoriteRepository extends JpaRepository<GameFavorite, UUID> {
    Optional<GameFavorite> findByGameId(UUID gameId);
}