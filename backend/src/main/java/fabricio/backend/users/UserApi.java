package fabricio.backend.users;

import java.util.Optional;
import java.util.UUID;

public interface UserApi {
    UserSummary createUser(CreateUserCommand command);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<UserAuthInfo> findUserAuthInfoById(UUID id);
    Optional<UserAuthInfo> findUserAuthInfoByUsername(String username);
    Optional<UserSummary> findUserSummaryById(UUID userId);
    String updateAvatar(UpdateAvatarCommand cmd);
}
