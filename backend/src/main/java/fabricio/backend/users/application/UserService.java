package fabricio.backend.users.application;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import fabricio.backend.users.CreateUserCommand;
import fabricio.backend.users.UserSummary;
import fabricio.backend.users.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.users.application.dtos.UserResponse;
import fabricio.backend.users.application.dtos.UserUpdateRequest;
import fabricio.backend.users.UserApi;
import fabricio.backend.users.UserAuthInfo;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.storage.IStorageService;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserApi {
    private final UserRepository userRepository;
    private final IStorageService storageService;
    private final RolePermissionRepository rolePermissionRepository;

    public UserService(
            UserRepository userRepository,
            IStorageService storageService,
            RolePermissionRepository rolePermissionRepository) {
        this.userRepository = userRepository;
        this.storageService = storageService;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    public UserResponse getUserById(UUID id) {
        var entity = userRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));;

        String fullAvatarUrl = storageService.getFullUrl(entity.getAvatarUrl());

        return UserResponse.builder()
            .id(entity.getId())
            .username(entity.getUsername())
            .fullName(entity.getFullName())
            .email(entity.getEmail())
            .bio(entity.getBio())
            .avatarUrl(fullAvatarUrl)
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Transactional
    public String uploadAvatar(UUID userId, MultipartFile file) {
        var userExist = userRepository.findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String objectname = userId + "/avatar-" + UUID.randomUUID();
        
        String oldAvatarUrl = userExist.getAvatarUrl();
        String avatarPath = storageService.uploadFile(objectname, file);
        if (oldAvatarUrl != null && !oldAvatarUrl.isEmpty()) {
            storageService.deleteFile(oldAvatarUrl);
        }

        userExist.setAvatarUrl(avatarPath);
        userRepository.save(userExist);

        return storageService.getFullUrl(avatarPath);
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UserUpdateRequest req) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.updateFromDTO(req);

        return UserResponse
            .builder()
            .id(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .bio(user.getBio())
            .avatarUrl(user.getAvatarUrl())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }

    @Override
    public Optional<User> findByUsernameForAuth(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserSummary createUser(CreateUserCommand command) {
        var entity = userRepository.save(User.create(
                command.username(),
                command.email(),
                command.fullName(),
                command.passwordHash()
        ));

        return new UserSummary(
                entity.getId(),
                entity.getEmail(),
                entity.getUsername(),
                entity.getFullName(),
                entity.getHashedPassword()
        );
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
    public Optional<UserAuthInfo> findUserAuthInfoByUsername(String username) {
        return userRepository.findByUsername(username).map(this::toAuthInfo);
    }

    private UserAuthInfo toAuthInfo(User u) {
        Set<String> permissions = rolePermissionRepository.findByRole(u.getRole()).stream()
                .map(rp -> rp.getPermission().getName())
                .collect(Collectors.toSet());
        return new UserAuthInfo(u.getId(), u.getEmail(), u.getUsername(), u.getFullName(),
                u.getHashedPassword(), u.getRole(), permissions);
    }
}
