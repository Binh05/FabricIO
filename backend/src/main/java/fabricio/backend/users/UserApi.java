package fabricio.backend.users;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface UserApi {
    UserSummary createUser(CreateUserCommand command);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<UserAuthInfo> findUserAuthInfoById(UUID id);
    Optional<UserAuthInfo> findUserAuthInfoByEmail(String email);
    Optional<UserSummary> findUserSummaryById(UUID userId);
    String updateAvatar(UpdateAvatarCommand cmd);
    Map<UUID, UserSummary> getAuthorsByIds(Collection<UUID> userIds);
}
