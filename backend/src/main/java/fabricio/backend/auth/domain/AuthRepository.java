package fabricio.backend.auth.domain;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;

@Repository
public interface AuthRepository extends JpaRepository<Session, UUID> {
    public Optional<Session> findByToken(String token);
    public void deleteByToken(String token);
}
