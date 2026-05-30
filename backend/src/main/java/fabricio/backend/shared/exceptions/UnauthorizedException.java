package fabricio.backend.shared.exceptions;

import lombok.Getter;

@Getter
public class UnauthorizedException extends RuntimeException {
    private int code;

    public UnauthorizedException(String message) {
        super(message);
        this.code = 401;
    }
}
