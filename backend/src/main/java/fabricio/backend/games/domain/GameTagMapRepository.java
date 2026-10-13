package fabricio.backend.games.domain;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameTagMapRepository extends JpaRepository<GameTagMap, GameTagMap.GameTagMapId> {
    List<GameTagMap> findByGameId(UUID gameId);
    void deleteByGameId(UUID gameId);
}
