package fabricio.backend.modules.users.internal;

import java.util.Optional;

import fabricio.backend.modules.users.entities.User;

public interface IUserInternalService {
    Optional<User> findByUsernameForAuth(String username);
    UserAuthDTO createUserFromAuth(String username, String email, String fullName, String hashedPassword);
    boolean exitsByEmail(String email);
    boolean existsByUsername(String username);
}
