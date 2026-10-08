package fabricio.backend.interactions.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fabricio.backend.interactions.entities.GameFavorite;

@Repository
public interface GameFavoriteRepository extends JpaRepository<GameFavorite, UUID> {
    Optional<GameFavorite> findByGameId(UUID gameId);
}