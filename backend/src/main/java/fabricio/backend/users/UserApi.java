package fabricio.backend.users;

import java.util.Optional;

import fabricio.backend.users.domain.User;

public interface UserApi {
    Optional<User> findByUsernameForAuth(String username);
    UserSummary createUserFromAuth(String username, String email, String fullName, String hashedPassword);
    boolean exitsByEmail(String email);
    boolean existsByUsername(String username);
}
