package fabricio.backend.users;

import fabricio.backend.users.domain.User;

import java.util.UUID;

public record UserSummary(
        UUID id,
        String username,
        String email,
        String fullName,
        String bio,
        String avatarKey
) {
    public static UserSummary from(User user) {
        if (user == null) return null;
        return new UserSummary(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getBio(),
                user.getAvatarUrl()
        );
    }
}