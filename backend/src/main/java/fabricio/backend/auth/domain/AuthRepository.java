package fabricio.backend.auth.domain;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<Session, UUID> {
    public Session findByToken(String token);
}
