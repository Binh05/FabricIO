package fabricio.backend.shared.exceptions;

import lombok.Getter;

@Getter
public class BadRequestException extends RuntimeException {
    private int code;

    public BadRequestException(String message) {
        super(message);
        this.code = 400;
    }
}
