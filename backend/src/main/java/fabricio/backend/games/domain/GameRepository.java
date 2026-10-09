package fabricio.backend.games.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, UUID> {
    Page<Game> findByIsDeletedFalseAndTitleContainingIgnoreCase(String keyword, Pageable pageable);
    Optional<Game> findByIdAndIsDeletedFalse(UUID id);
}
