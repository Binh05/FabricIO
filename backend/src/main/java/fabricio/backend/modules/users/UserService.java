package fabricio.backend.modules.users;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.modules.users.dtos.UserResponse;
import fabricio.backend.modules.users.dtos.UserUpdateRequest;
import fabricio.backend.modules.users.entities.User;
import fabricio.backend.modules.users.internal.IUserInternalService;
import fabricio.backend.modules.users.internal.UserAuthDTO;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.storage.IStorageService;
import jakarta.transaction.Transactional;

@Service
public class UserService implements IUserService, IUserInternalService {
    private final UserRepository userRepository;
    private final IStorageService storageService;

    public UserService(UserRepository userRepository, IStorageService storageService) {
        this.userRepository = userRepository;
        this.storageService = storageService;
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

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findByUsernameForAuth(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserAuthDTO createUserFromAuth(String username, String email, String fullName, String hashedPassword) {
        User entity = new User();
        entity.setUsername(username);
        entity.setHashedPassword(hashedPassword);
        entity.setEmail(email);
        entity.setFullName(fullName);

        var userSaved = userRepository.save(entity);

        return new UserAuthDTO(userSaved.getId(), userSaved.getEmail(), userSaved.getUsername(), userSaved.getFullName(), userSaved.getHashedPassword());
    }

    @Override
    public boolean exitsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional
    public String uploadAvatar(UUID userId, MultipartFile file) {
        var userExist = userRepository.findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String objectname = userId + "/avatar-" + UUID.randomUUID();
        
        String avatarPath = storageService.uploadFile(objectname, file);

        userExist.setAvatarUrl(avatarPath);
        userRepository.save(userExist);

        return storageService.getFullUrl(avatarPath);
    }

    @Override
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
}
