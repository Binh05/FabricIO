package fabricio.backend.users.domain.exception;

import fabricio.backend.shared.exceptions.AppException;

public class UserException extends AppException {

    public UserException(UserErrorCode errorCode) {
        super(
                errorCode.getStatus(),
                errorCode.getMessage(),
                errorCode.name()
        );
    }

    public UserException(UserErrorCode errorCode, Throwable cause) {
        super(
                errorCode.getStatus(),
                errorCode.getMessage(),
                errorCode.name(),
                cause
        );
    }
}
