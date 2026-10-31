package fabricio.backend.games.domain.exception;

import fabricio.backend.shared.exceptions.AppException;

public class GameException extends AppException {
    public GameException(GameErrorCode errorCode) {
        super(
                errorCode.getStatus(),
                errorCode.getMessage(),
                errorCode.name()
        );
    }

    public GameException(GameErrorCode errorCode, Throwable cause) {
        super(
                errorCode.getStatus(),
                errorCode.getMessage(),
                errorCode.name(),
                cause
        );
    }
}
