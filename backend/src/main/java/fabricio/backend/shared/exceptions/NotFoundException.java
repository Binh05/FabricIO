package fabricio.backend.shared.exceptions;

import lombok.Getter;

@Getter
public class NotFoundException extends RuntimeException {
    private int code;

    public NotFoundException(String message) {
        super(message);
        this.code = 404;
    }
}
