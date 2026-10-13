package fabricio.backend.shared.exceptions;

import lombok.Getter;

@Getter
public enum ErrorCode {
    GAME_NOT_FOUND(404, "Game không tồn tại"),
    GAME_TAG_INVALID(400, "Game tag không hợp lệ"),
    USER_NOT_FOUND(404, "User không tồn tại"),
    RATING_NOT_FOUND(404, "Rating không tồn tại"),
    ACCESS_DENIED(403, "Không có quyền truy cập"),
    EMAIL_EXISTED(409, "Email đã được sử dụng"),
    USERNAME_EXISTED(409, "Username đã được sử dụng"),
    ACCOUNT_ERROR(400, "Tài khoản hoặc mật khẩu không đúng"),
    FAILED_UPLOAD_FILE(500, "Lỗi khi upload file"),
    FAILED_GET_FILE(500, "Lỗi khi get file"),
    FAILED_DELETE_FILE(500, "Lỗi khi delete file"),
    MAX_FILE_UPLOAD_EXCEEDED(400, "Lỗi file đăng tải vượt quá giới hạn cho phép");

    private final int status;
    private final String message;

    ErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
