package fabricio.backend.games.application.dtos;

import fabricio.backend.users.UserSummary;

import java.util.UUID;

public record AuthorDto(
    UUID id,
    String username,
    String fullName,
    String avatarUrl,
    String bio
) {
    public static AuthorDto fromUserSummary(UserSummary user) {
        return new AuthorDto(
                user.id(),
                user.username(),
                user.fullName(),
                user.avatarUrl(),
                user.bio() != null ? user.bio() : ""
        );
    }
}