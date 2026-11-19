package fabricio.backend.comment.domain.exception;

import fabricio.backend.shared.exceptions.AppException;

public class CommentException extends AppException {
    public CommentException(CommentErrorCode e) {
        super(
                e.getStatus(),
                e.getMessage(),
                e.name()
        );
    }

    public CommentException(CommentErrorCode e, Throwable cause) {
        super(
                e.getStatus(),
                e.getMessage(),
                e.name(),
                cause
        );
    }
}
