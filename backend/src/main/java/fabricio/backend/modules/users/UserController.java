package fabricio.backend.modules.users;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.modules.auth.jwt.UserPrincipal;
import fabricio.backend.modules.users.dtos.UploadAvatarResponse;
import fabricio.backend.modules.users.dtos.UserResponse;
import fabricio.backend.modules.users.dtos.UserUpdateRequest;
import fabricio.backend.modules.users.entities.User;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "User", description = "Các api quản lý user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/me")
    public UserResponse fetchMe(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return userService.getUserById(userPrincipal.getId());
    }

    @GetMapping("/user/{id}")
    public UserResponse getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @GetMapping("/user")
    public List<User> getAllUser() {
        return userService.getAllUser();
    }

    @PostMapping(value = "/user/avatar", consumes = {"multipart/form-data"})
    public UploadAvatarResponse uploadAvatar(@ModelAttribute MultipartFile imageFile, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String url = userService.uploadAvatar(userPrincipal.getId(), imageFile);
        return new UploadAvatarResponse(url);
    }

    @PatchMapping("/user")
    public UserResponse updateProfile(@RequestBody UserUpdateRequest req, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return userService.updateProfile(userPrincipal.getId(), req);
    }
}
