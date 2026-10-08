package fabricio.backend.users;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.users.dtos.UserResponse;
import fabricio.backend.users.dtos.UserUpdateRequest;
import fabricio.backend.users.entities.User;

public interface IUserService {
    public UserResponse getUserById(UUID id);
    public List<User> getAllUser();
    public String uploadAvatar(UUID userId, MultipartFile file);
    public UserResponse updateProfile(UUID userId, UserUpdateRequest req);
}
