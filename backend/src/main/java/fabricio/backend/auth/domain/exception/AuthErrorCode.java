package fabricio.backend.auth.domain.exception;

import lombok.Getter;

@Getter
public enum AuthErrorCode {
    EMAIL_EXISTED(409, "Email đã được sử dụng"),
    USERNAME_EXISTED(409, "Username đã được sử dụng"),
    ACCOUNT_ERROR(400, "Tài khoản hoặc mật khẩu không đúng"),
    ACCESS_DENIED(403, "Không có quyền truy cập");

    private final int status;
    private final String message;

    AuthErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
