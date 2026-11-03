package fabricio.backend.upload.domain.exception;

import fabricio.backend.shared.exceptions.AppException;

public class UploadException extends AppException {

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
