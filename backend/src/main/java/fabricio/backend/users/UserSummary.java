package fabricio.backend.users;

import fabricio.backend.users.domain.User;

import java.util.UUID;

public record UserSummary(
        UUID id,
        String fullName,
        String avatarUrl,
        String bio
) {
    public static UserSummary from(User user) {
        if (user == null) return null;
        return new UserSummary(
                user.getId(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getBio()
        );
    }
}