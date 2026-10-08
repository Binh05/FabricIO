package fabricio.backend.games.repositories;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import fabricio.backend.games.entities.GameMedia;

@Repository
public interface GameMediaRepository extends JpaRepository<GameMedia, UUID> {
    List<GameMedia> findByGameIdId(UUID gameId);
    void deleteByGameIdId(UUID gameId);
}
