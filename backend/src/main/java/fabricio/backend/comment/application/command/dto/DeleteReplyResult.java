package fabricio.backend.comment.application.command.dto;

import java.util.UUID;

public record DeleteReplyResult(
        UUID parentId,
        Integer replyCount
) {
}
