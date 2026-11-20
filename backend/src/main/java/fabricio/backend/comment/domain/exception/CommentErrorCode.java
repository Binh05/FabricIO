package fabricio.backend.comment.domain.exception;

import lombok.Getter;

@Getter
public enum CommentErrorCode {
    COMMENT_NOT_FOUND(404, "Comment bạn trả lời không tồn tại"),
    ACCESS_DENIED(403, "Bạn không có quyền xóa comment này"),
    REPLY_INVALID_ID(400, "Reply Comment bạn xóa không hợp lệ"),
    COMMENT_INVALID_ID(400, "Reply Comment bạn xóa không hợp lệ");

    private final int status;
    private final String message;

    CommentErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
