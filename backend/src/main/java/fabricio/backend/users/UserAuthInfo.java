package fabricio.backend.users;

import fabricio.backend.shared.enums.UserRole;

import java.util.Set;
import java.util.UUID;

public record UserAuthInfo(
        UUID id,
        String email,
        String username,
        String fullName,
        String hashedPassword,
        UserRole role,
        Set<String> permission) { }

