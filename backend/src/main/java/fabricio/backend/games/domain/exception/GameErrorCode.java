package fabricio.backend.games.domain.exception;

import lombok.Getter;

@Getter
public enum GameErrorCode {
    GAME_REQUIRE_NULL(400, "Thiếu source game hoặc thumbnail game"),
    GAME_ACCESS_DENIED(403, "Bạn không có quyền truy cập game"),
    ASSET_TYPE_INVALID(400, "Asset Game Type không hợp lệ"),
    GAME_NOT_FOUND(404, "Game không tồn tại"),
    GAME_TAG_INVALID(400, "Game tag không hợp lệ"),
    RATING_NOT_FOUND(404, "Rating không tồn tại"),
    TAG_NOT_FOUND(404, "Tag không tìm thấy"),
    TAG_NAME_EXISTED(409, "Tên tag đã tồn tại");

    private final int status;
    private final String message;

    GameErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
