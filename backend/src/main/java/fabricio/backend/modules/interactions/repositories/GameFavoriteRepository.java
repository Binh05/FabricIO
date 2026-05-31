package fabricio.backend.modules.interactions.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fabricio.backend.modules.interactions.entities.GameFavorite;

@Repository
public interface GameFavoriteRepository extends JpaRepository<GameFavorite, UUID> {
    Optional<GameFavorite> findByGameId(UUID gameId);
}