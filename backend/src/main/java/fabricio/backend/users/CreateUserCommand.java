package fabricio.backend.users;

import java.util.UUID;

public record CreateUserCommand(
        String username,
        String email,
        String fullName,
        String passwordHash
) {}