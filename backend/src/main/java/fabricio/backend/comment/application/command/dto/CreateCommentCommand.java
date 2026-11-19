package fabricio.backend.comment.application.command.dto;

import java.util.UUID;

public record CreateCommentCommand(
        UUID userId,
        UUID gameId,
        UUID parentId,
        UUID replyToCommentId,
        String content
) {
}
