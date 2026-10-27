package fabricio.backend.shared.exceptions;

import lombok.Getter;

@Getter
public abstract class AppException extends RuntimeException {
    private final int status;
    private final String code;

    public AppException(int status, String message, String code) {
        super(message);
        this.status = status;
        this.code = code;
    }

    public AppException(int status, String message, String code, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.code = code;
    }
}
