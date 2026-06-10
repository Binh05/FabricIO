package fabricio.backend.modules.games.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fabricio.backend.modules.games.entities.GameTag;

@Repository
public interface GameTagRepository extends JpaRepository<GameTag, UUID> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, UUID id);
}
