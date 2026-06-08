package fabricio.backend.modules.users;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.modules.auth.jwt.UserPrincipal;
import fabricio.backend.modules.users.dtos.UploadAvatarResponse;
import fabricio.backend.modules.users.dtos.UserResponse;
import fabricio.backend.modules.users.dtos.UserUpdateRequest;
import fabricio.backend.modules.users.entities.User;
import fabricio.backend.shared.base.ApiResponse;
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
    public ApiResponse<UserResponse> fetchMe(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        var res = userService.getUserById(userPrincipal.getId());
        return ApiResponse.success(res);
    }

    @GetMapping("/user/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable UUID id) {
        return ApiResponse.success(userService.getUserById(id));
    }

    @GetMapping("/user")
    public ApiResponse<List<User>> getAllUser() {
        return ApiResponse.success(userService.getAllUser());
    }

    @PostMapping(value = "/user/avatar", consumes = {"multipart/form-data"})
    public ApiResponse<UploadAvatarResponse> uploadAvatar(@ModelAttribute MultipartFile imageFile, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String url = userService.uploadAvatar(userPrincipal.getId(), imageFile);
        return ApiResponse.success(new UploadAvatarResponse(url));
    }

    @PatchMapping("/user")
    public ApiResponse<UserResponse> updateProfile(@RequestBody UserUpdateRequest req, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        var res = userService.updateProfile(userPrincipal.getId(), req);
        return ApiResponse.success(res);
    }
}
