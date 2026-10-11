package fabricio.backend.users;

import fabricio.backend.shared.security.Permission;
import fabricio.backend.shared.security.Role;

import java.util.Set;
import java.util.UUID;

public record UserAuthInfo(
        UUID id,
        String email,
        String username,
        String fullName,
        String hashedPassword,
        Role role,
        Set<Permission> permission) { }

