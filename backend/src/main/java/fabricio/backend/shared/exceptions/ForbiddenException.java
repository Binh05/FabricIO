package fabricio.backend.shared.exceptions;

import lombok.Getter;

@Getter
public class ForbiddenException extends RuntimeException {
    private int code;

    public ForbiddenException(String message) {
        super(message);
        this.code = 403;
    }
}
