package fabricio.backend.users.application.dtos;

import java.time.Instant;
import java.util.UUID;

import fabricio.backend.shared.security.Role;
import fabricio.backend.users.domain.User;

public record UserResponse(
    UUID id,
    String username,
    String email,
    String fullName,
    String bio,
    String avatarUrl,
    Role role,
    Instant createdAt,
    Instant updatedAt
) {
    public UserResponse(UUID id, String username, String email, String fullName) {
        this(id, username, email, fullName, null, null, Role.User, Instant.now(), Instant.now());
    }

    public static UserResponse fromEntity(User u, String avatarUrl) {
        return new UserResponse(
            u.getId(),
            u.getUsername(),
            u.getEmail(),
            u.getFullName(),
            u.getBio(),
            avatarUrl,
            u.getRole(),
            u.getCreatedAt(),
            u.getUpdatedAt()
        );
    }
}
