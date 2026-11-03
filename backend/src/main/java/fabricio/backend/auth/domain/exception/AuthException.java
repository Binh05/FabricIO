package fabricio.backend.auth.domain.exception;

import fabricio.backend.shared.exceptions.AppException;

public class AuthException extends AppException {

    public AuthException(AuthErrorCode errorCode) {
        super(
                errorCode.getStatus(),
                errorCode.getMessage(),
                errorCode.name()
        );
    }

    public AuthException(AuthErrorCode errorCode, Throwable cause) {
        super(
                errorCode.getStatus(),
                errorCode.getMessage(),
                errorCode.name(),
                cause
        );
    }
}
