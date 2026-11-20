package fabricio.backend.comment.application.command.dto;

public record LikeCommentResult(
        boolean liked,
        int likeCount
) {
}
