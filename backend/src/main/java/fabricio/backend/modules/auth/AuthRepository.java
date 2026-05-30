package fabricio.backend.modules.auth;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fabricio.backend.modules.auth.entities.Session;

@Repository
public interface AuthRepository extends JpaRepository<Session, UUID> {
    public Session findByToken(String token);
}
