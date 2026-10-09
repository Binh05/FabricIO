package fabricio.backend.shared.mock;

import java.util.UUID;

import fabricio.backend.users.domain.User;
import fabricio.backend.shared.enums.UserRole;

public class UserMockFactory {

    public static User createMockUser() {
        User user = new User();

        user.setId(UUID.randomUUID());
        user.setUsername("john");
        user.setEmail("john@gmail.com");
        user.setHashedPassword("hashed");
        user.setRole(UserRole.User);

        return user;
    }
}
