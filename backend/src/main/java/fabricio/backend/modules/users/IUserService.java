package fabricio.backend.modules.users;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.modules.users.dtos.UserResponse;
import fabricio.backend.modules.users.entities.User;

public interface IUserService {
    public UserResponse getUserById(UUID id);
    public List<User> getAllUser();
    public String uploadAvatar(UUID userId, MultipartFile file);
}
