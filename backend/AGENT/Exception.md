```public class UploadException extends AppException {

    public UploadException(UploadErrorCode errorCode) {
        super(
                errorCode.getStatus(),
                errorCode.getMessage(),
                errorCode.name()
        );
    }

    public UploadException(UploadErrorCode errorCode, Throwable cause) {
        super(
                errorCode.getStatus(),
                errorCode.getMessage(),
                errorCode.name(),
                cause
        );
    }
}
```
```text
@Getter
public enum UploadErrorCode {
    CONTENT_TYPE_NOT_SUPPORTED(400, "Content type chưa được hỗ trợ"),
    MAX_FILE_UPLOAD_EXCEEDED(400, "Lỗi file đăng tải vượt quá giới hạn cho phép"),
    KEY_INVALID(400, "Key upload không hợp lệ"),
    FILE_NOT_UPLOADED(400, "File này chưa được upload"),
    FILE_UPLOADED_INVALID(400, "File được upload có dung lượng hoặc thuộc loại không hợp lệ"),
    OBJECT_ID_NULL(400, "Object Id không được để trống"),
    PURPOSE_UPLOAD_INVALID(400, "Mục đích upload không hợp lệ"),
    ZIP_EXTRACTED_TOO_MUCH(400, "File upload sau khi giải nén quá nhiều"),
    ZIP_EXTRACTED_TOO_LARGE(400, "Zip too large when extracted"),
    ZIP_ENTRY_TOO_LARGE(400, "Zip entry too large");

    private final int status;
    private final String message;

    UploadErrorCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}

```

#### USAGE:

```text
if (!purpose.allow(cmd.contentType())) throw new UploadException(UploadErrorCode.CONTENT_TYPE_NOT_SUPPORTED);
```