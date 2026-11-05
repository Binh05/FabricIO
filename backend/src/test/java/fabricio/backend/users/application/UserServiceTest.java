package fabricio.backend.users.application;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import fabricio.backend.shared.security.Role;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.users.CreateUserCommand;
import fabricio.backend.users.UpdateAvatarCommand;
import fabricio.backend.users.UserAuthInfo;
import fabricio.backend.users.UserSummary;
import fabricio.backend.users.application.dtos.UserResponse;
import fabricio.backend.users.application.dtos.UserUpdateRequest;
import fabricio.backend.users.domain.User;
import fabricio.backend.users.domain.UserRepository;
import fabricio.backend.users.domain.exception.UserErrorCode;
import fabricio.backend.users.domain.exception.UserException;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ObjectStorage storage;

    @InjectMocks
    private UserService userService;

    private UUID userId;
    private User mockUser;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        mockUser = User.create("testuser", "test@example.com", "Test User", "hashed-pw");
        mockUser.setId(userId);
        mockUser.setAvatarUrl("avatars/avatar1.png");
        mockUser.setBio("Hello world");
    }

    // ==================== GET USER BY ID ====================

    @Test
    @DisplayName("getUserById: thành công khi user tồn tại")
    void getUserById_success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(storage.publicUrl("avatars/avatar1.png")).thenReturn("https://storage/avatars/avatar1.png");

        UserResponse response = userService.getUserById(userId);

        assertNotNull(response);
        assertEquals(userId, response.getId());
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("Test User", response.getFullName());
        assertEquals("Hello world", response.getBio());
        assertEquals("https://storage/avatars/avatar1.png", response.getAvatarUrl());
    }

    @Test
    @DisplayName("getUserById: ném UserException khi không tìm thấy user")
    void getUserById_notFound_throwsException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        UserException ex = assertThrows(UserException.class, () -> userService.getUserById(userId));

        assertEquals(UserErrorCode.USER_NOT_FOUND.name(), ex.getCode());
        assertEquals(404, ex.getStatus());
    }

    // ==================== GET ALL USERS ====================

    @Test
    @DisplayName("getAllUser: trả về danh sách user")
    void getAllUser_returnsList() {
        List<User> list = List.of(mockUser);
        when(userRepository.findAll()).thenReturn(list);

        List<User> result = userService.getAllUser();

        assertEquals(1, result.size());
        assertEquals(mockUser, result.get(0));
    }

    // ==================== UPDATE PROFILE ====================

    @Test
    @DisplayName("updateProfile: cập nhật bio và fullName khi user tồn tại")
    void updateProfile_success() {
        UserUpdateRequest req = new UserUpdateRequest();
        req.setFullName("Updated Name");
        req.setBio("Updated Bio");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        UserResponse response = userService.updateProfile(userId, req);

        assertNotNull(response);
        assertEquals("Updated Name", response.getFullName());
        assertEquals("Updated Bio", response.getBio());
        assertEquals(mockUser.getUsername(), response.getUsername());
    }

    @Test
    @DisplayName("updateProfile: ném UserException khi không tìm thấy user")
    void updateProfile_notFound_throwsException() {
        UserUpdateRequest req = new UserUpdateRequest();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        UserException ex = assertThrows(UserException.class, () -> userService.updateProfile(userId, req));

        assertEquals(UserErrorCode.USER_NOT_FOUND.name(), ex.getCode());
    }

    // ==================== CREATE USER ====================

    @Test
    @DisplayName("createUser: lưu user và trả về UserSummary")
    void createUser_success() {
        CreateUserCommand cmd = new CreateUserCommand("newuser", "new@example.com", "New User", "hash123");
        User savedUser = User.create(cmd.username(), cmd.email(), cmd.fullName(), cmd.passwordHash());
        savedUser.setId(UUID.randomUUID());

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserSummary summary = userService.createUser(cmd);

        assertNotNull(summary);
        assertEquals("newuser", summary.username());
        assertEquals("new@example.com", summary.email());
        assertEquals("New User", summary.fullName());
    }

    // ==================== EXISTS BY EMAIL / USERNAME ====================

    @Test
    @DisplayName("existsByEmail: kiểm tra email tồn tại hay không")
    void existsByEmail_returnsRepoValue() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        when(userRepository.existsByEmail("notfound@example.com")).thenReturn(false);

        assertTrue(userService.existsByEmail("test@example.com"));
        assertFalse(userService.existsByEmail("notfound@example.com"));
    }

    @Test
    @DisplayName("existsByUsername: kiểm tra username tồn tại hay không")
    void existsByUsername_returnsRepoValue() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        when(userRepository.existsByUsername("notfound")).thenReturn(false);

        assertTrue(userService.existsByUsername("testuser"));
        assertFalse(userService.existsByUsername("notfound"));
    }

    // ==================== FIND USER AUTH INFO ====================

    @Test
    @DisplayName("findUserAuthInfoById: trả về Optional<UserAuthInfo>")
    void findUserAuthInfoById_success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        Optional<UserAuthInfo> authInfo = userService.findUserAuthInfoById(userId);

        assertTrue(authInfo.isPresent());
        assertEquals(userId, authInfo.get().id());
        assertEquals("testuser", authInfo.get().username());
        assertEquals("hashed-pw", authInfo.get().hashedPassword());
        assertEquals(Role.User, authInfo.get().role());
    }

    @Test
    @DisplayName("findUserAuthInfoById: trả về empty khi không tìm thấy")
    void findUserAuthInfoById_notFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        Optional<UserAuthInfo> authInfo = userService.findUserAuthInfoById(userId);

        assertTrue(authInfo.isEmpty());
    }

    @Test
    @DisplayName("findUserAuthInfoByUsername: trả về Optional<UserAuthInfo>")
    void findUserAuthInfoByUsername_success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));

        Optional<UserAuthInfo> authInfo = userService.findUserAuthInfoByUsername("testuser");

        assertTrue(authInfo.isPresent());
        assertEquals("testuser", authInfo.get().username());
    }

    @Test
    @DisplayName("findUserAuthInfoByUsername: trả về empty khi không tìm thấy")
    void findUserAuthInfoByUsername_notFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        Optional<UserAuthInfo> authInfo = userService.findUserAuthInfoByUsername("unknown");

        assertTrue(authInfo.isEmpty());
    }

    // ==================== FIND USER SUMMARY BY ID ====================

    @Test
    @DisplayName("findUserSummaryById: trả về Optional<UserSummary>")
    void findUserSummaryById_success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        Optional<UserSummary> summary = userService.findUserSummaryById(userId);

        assertTrue(summary.isPresent());
        assertEquals("testuser", summary.get().username());
        assertEquals("test@example.com", summary.get().email());
    }

    @Test
    @DisplayName("findUserSummaryById: trả về empty khi không tìm thấy")
    void findUserSummaryById_notFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        Optional<UserSummary> summary = userService.findUserSummaryById(userId);

        assertTrue(summary.isEmpty());
    }

    // ==================== UPDATE AVATAR ====================

    @Test
    @DisplayName("updateAvatar: trả về oldKey khi key mới trùng với key cũ")
    void updateAvatar_sameKey_returnsOldKey() {
        UpdateAvatarCommand cmd = new UpdateAvatarCommand(userId, "avatars/avatar1.png");
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        String oldKey = userService.updateAvatar(cmd);

        assertEquals("avatars/avatar1.png", oldKey);
        assertEquals("avatars/avatar1.png", mockUser.getAvatarUrl());
    }

    @Test
    @DisplayName("updateAvatar: cập nhật key mới và trả về key cũ khi key thay đổi")
    void updateAvatar_differentKey_updatesAndReturnsOldKey() {
        UpdateAvatarCommand cmd = new UpdateAvatarCommand(userId, "avatars/new-avatar.png");
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        String oldKey = userService.updateAvatar(cmd);

        assertEquals("avatars/avatar1.png", oldKey);
        assertEquals("avatars/new-avatar.png", mockUser.getAvatarUrl());
    }

    @Test
    @DisplayName("updateAvatar: ném UserException khi không tìm thấy user")
    void updateAvatar_notFound_throwsException() {
        UpdateAvatarCommand cmd = new UpdateAvatarCommand(userId, "avatars/new.png");
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> userService.updateAvatar(cmd));
    }
}
