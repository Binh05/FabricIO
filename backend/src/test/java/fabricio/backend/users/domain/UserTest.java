package fabricio.backend.users.domain;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import fabricio.backend.shared.security.Role;
import fabricio.backend.users.application.dtos.UserUpdateRequest;

class UserTest {

    @Test
    @DisplayName("User.create: khởi tạo user với đúng thông tin và giá trị mặc định")
    void create_setsFieldsAndDefaults() {
        User user = User.create("alice", "alice@example.com", "Alice Wonderland", "hashed123");

        assertEquals("alice", user.getUsername());
        assertEquals("alice@example.com", user.getEmail());
        assertEquals("Alice Wonderland", user.getFullName());
        assertEquals("hashed123", user.getHashedPassword());
        assertEquals(Role.User, user.getRole());
        assertTrue(user.isActive());
        assertFalse(user.isDeleted());
    }

    @Test
    @DisplayName("updateFromDTO: cập nhật bio và fullName khi khác null")
    void updateFromDTO_updatesNonNullFields() {
        User user = User.create("bob", "bob@example.com", "Bob Original", "hashed");
        user.setBio("Original bio");

        UserUpdateRequest req = new UserUpdateRequest();
        req.setBio("New bio");
        req.setFullName("Bob New");

        user.updateFromDTO(req);

        assertEquals("New bio", user.getBio());
        assertEquals("Bob New", user.getFullName());
    }

    @Test
    @DisplayName("updateFromDTO: không thay đổi giá trị khi các trường trong request là null")
    void updateFromDTO_ignoresNullFields() {
        User user = User.create("bob", "bob@example.com", "Bob Original", "hashed");
        user.setBio("Original bio");

        UserUpdateRequest req = new UserUpdateRequest();
        req.setBio(null);
        req.setFullName(null);

        user.updateFromDTO(req);

        assertEquals("Original bio", user.getBio());
        assertEquals("Bob Original", user.getFullName());
    }
}
