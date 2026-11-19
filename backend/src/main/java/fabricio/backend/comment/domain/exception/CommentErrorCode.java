package fabricio.backend.comment.domain.exception;

import lombok.Getter;

@Getter
public enum CommentErrorCode {
    COMMENT_NOT_FOUND(404, "Comment bạn trả lời không tồn tại");

    private final int status;
    private final String message;

    CommentErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
