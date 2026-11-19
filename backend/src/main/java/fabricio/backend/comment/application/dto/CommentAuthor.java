package fabricio.backend.comment.application.dto;

import fabricio.backend.users.UserSummary;

import java.util.UUID;

public record CommentAuthor(
        UUID id,
        String username,
        String fullName,
        String avatarUrl
) {
    public static CommentAuthor fromSummary(UserSummary u) {
        return new CommentAuthor(
            u.id(),
            u.username(),
            u.fullName(),
            u.avatarUrl()
        );
    }
}
