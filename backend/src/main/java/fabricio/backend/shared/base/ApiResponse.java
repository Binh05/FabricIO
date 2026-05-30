package fabricio.backend.shared.base;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .code(200)
            .message("Success")
            .data(data)
            .build();
    }

    public static <T> ApiResponse<T> noContent() {
        return ApiResponse.<T>builder()
            .code(204)
            .message("No Content")
            .build();
    }
}
