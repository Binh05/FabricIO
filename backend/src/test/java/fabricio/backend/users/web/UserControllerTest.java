package fabricio.backend.users.web;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.security.Role;
import fabricio.backend.shared.security.UserPrincipal;
import fabricio.backend.users.application.UserService;
import fabricio.backend.users.application.dtos.UserResponse;
import fabricio.backend.users.application.dtos.UserUpdateRequest;
import fabricio.backend.users.domain.User;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private UUID userId;
    private UserResponse mockUserResponse;
    private UserPrincipal userPrincipal;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        mockUserResponse = UserResponse.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .build();
        userPrincipal = new UserPrincipal(userId, "testuser", "test@example.com", "pass", Role.User);
    }

    @Test
    @DisplayName("fetchMe: trả về thông tin của current user")
    void fetchMe_success() {
        when(userService.getUserById(userId)).thenReturn(mockUserResponse);

        ApiResponse<UserResponse> response = userController.fetchMe(userPrincipal);

        assertNotNull(response);
        assertEquals(mockUserResponse, response.getData());
        verify(userService).getUserById(userId);
    }

    @Test
    @DisplayName("getUserById: trả về thông tin user theo ID")
    void getUserById_success() {
        when(userService.getUserById(userId)).thenReturn(mockUserResponse);

        ApiResponse<UserResponse> response = userController.getUserById(userId);

        assertNotNull(response);
        assertEquals(mockUserResponse, response.getData());
        verify(userService).getUserById(userId);
    }

    @Test
    @DisplayName("getAllUser: trả về danh sách tất cả user")
    void getAllUser_success() {
        User user = User.create("testuser", "test@example.com", "Test User", "pw");
        when(userService.getAllUser()).thenReturn(List.of(user));

        ApiResponse<List<User>> response = userController.getAllUser();

        assertNotNull(response);
        assertEquals(1, response.getData().size());
        verify(userService).getAllUser();
    }

    @Test
    @DisplayName("updateProfile: cập nhật profile cho user hiện tại")
    void updateProfile_success() {
        UserUpdateRequest req = new UserUpdateRequest();
        req.setFullName("Updated Name");

        when(userService.updateProfile(userId, req)).thenReturn(mockUserResponse);

        ApiResponse<UserResponse> response = userController.updateProfile(req, userPrincipal);

        assertNotNull(response);
        assertEquals(mockUserResponse, response.getData());
        verify(userService).updateProfile(userId, req);
    }
}
