package fabricio.backend.shared.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.enums.ErrorCode;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse<Void> response = ApiResponse.<Void>builder()
            .code(errorCode.getStatus())
            .message(errorCode.getMessage())
            .build();
        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGlobalException(Exception ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
            .code(500)
            .message("Internal Server Error: " + ex.getMessage())
            .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
