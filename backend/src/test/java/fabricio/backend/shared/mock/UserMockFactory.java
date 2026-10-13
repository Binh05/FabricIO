package fabricio.backend.shared.mock;

import java.util.UUID;

import fabricio.backend.users.domain.User;
import fabricio.backend.shared.security.Role;

public class UserMockFactory {

    public static User createMockUser() {
        User user = new User();

        user.setId(UUID.randomUUID());
        user.setUsername("john");
        user.setEmail("john@gmail.com");
        user.setHashedPassword("hashed");
        user.setRole(Role.User);

        return user;
    }
}
