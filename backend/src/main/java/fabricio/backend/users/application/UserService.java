package fabricio.backend.users.application;

import java.util.*;
import java.util.stream.Collectors;

import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.users.UpdateAvatarCommand;
import fabricio.backend.users.CreateUserCommand;
import fabricio.backend.users.UserSummary;
import fabricio.backend.users.domain.*;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import fabricio.backend.users.application.dtos.UserResponse;
import fabricio.backend.users.application.dtos.UserUpdateRequest;
import fabricio.backend.users.application.dtos.FetchUserResult;
import fabricio.backend.users.UserApi;
import fabricio.backend.users.UserAuthInfo;
import fabricio.backend.users.domain.exception.UserErrorCode;
import fabricio.backend.users.domain.exception.UserException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserApi {
    private final UserRepository userRepository;
    private final ObjectStorage storage;

    public UserService(
            UserRepository userRepository,
            ObjectStorage storage
    ) {
        this.userRepository = userRepository;
        this.storage = storage;
    }

    public FetchUserResult getUserByUsername(String username) {
        var entity = userRepository.findByUsername(username)
            .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        return new FetchUserResult(
                entity.getId(),
                entity.getUsername(),
                entity.getFullName(),
                entity.getBio(),
                storage.publicUrl(entity.getAvatarUrl()),
                entity.getCreatedAt()
        );
    }

    public UserResponse getCurrentUserById(UUID id) {
        var entity = userRepository.findById(id)
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        return UserResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .bio(entity.getBio())
                .avatarUrl(storage.publicUrl(entity.getAvatarUrl()))
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UserUpdateRequest req) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));

        user.updateFromDTO(req);

        return UserResponse
            .builder()
            .id(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .bio(user.getBio())
            .avatarUrl(storage.publicUrl(user.getAvatarUrl()))
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }

    @Override
    public UserSummary createUser(CreateUserCommand command) {
        var entity = userRepository.save(User.create(
                command.username(),
                command.email(),
                command.fullName(),
                command.passwordHash()
        ));

        return UserSummary.from(entity);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<UserAuthInfo> findUserAuthInfoById(UUID id) {
        return userRepository.findById(id).map(this::toAuthInfo);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserAuthInfo> findUserAuthInfoByEmail(String email) {
        return userRepository.findByEmail(email).map(this::toAuthInfo);
    }

    @Override
    public Optional<UserSummary> findUserSummaryById(UUID userId) {
        return userRepository.findById(userId).map(this::toSummary);
    }

    @Override
    @Nullable
    @Transactional
    public String updateAvatar(UpdateAvatarCommand cmd) {
        User user = userRepository.findById(cmd.userId())
                .orElseThrow(() -> new UserException(UserErrorCode.USER_NOT_FOUND));
        String key = cmd.key();
        String oldKey = user.getAvatarUrl();

        if (key.equals(oldKey)) return oldKey;

        user.setAvatarUrl(key);
        return oldKey;
    }

    @Override
    @Transactional
    public Map<UUID, UserSummary> getAuthorsByIds(Collection<UUID> userIds) {
        if (userIds.isEmpty()) {
            return Map.of();
        }

        return userRepository.findAllById(userIds)
                .stream()
                .collect(Collectors.toMap(
                        User::getId,
                        this::toSummary
                ));
    }

    private UserAuthInfo toAuthInfo(User u) {
        return new UserAuthInfo(u.getId(), u.getEmail(), u.getUsername(), u.getFullName(),
                u.getHashedPassword(), u.getRole(), u.getRole().getPermissions());
    }

    private UserSummary toSummary(User u) {
        if (u == null) return null;
        return new UserSummary(
                u.getId(),
                u.getUsername(),
                u.getFullName(),
                storage.publicUrl(u.getAvatarUrl()),
                u.getBio()
        );
    }
}
