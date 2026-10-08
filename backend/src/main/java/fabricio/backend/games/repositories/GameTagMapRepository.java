package fabricio.backend.games.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fabricio.backend.games.entities.GameTagMap;

@Repository
public interface GameTagMapRepository extends JpaRepository<GameTagMap, GameTagMap.GameTagMapId> {
    List<GameTagMap> findByGameId(UUID gameId);
    void deleteByGameId(UUID gameId);
}
