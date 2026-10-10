package fabricio.backend.users;

import java.util.Optional;
import java.util.UUID;

import fabricio.backend.users.domain.User;

public interface UserApi {
    Optional<User> findByUsernameForAuth(String username);
    UserSummary createUser(CreateUserCommand command);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<UserAuthInfo> findUserAuthInfoById(UUID id);
    Optional<UserAuthInfo> findUserAuthInfoByUsername(String username);
}
