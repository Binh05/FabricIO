package fabricio.backend.shared.exceptions;

import lombok.Getter;

@Getter
public enum ErrorCode {
    CAN_NOT_ENCODE(500, "Không thể mã hóa cursor");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
