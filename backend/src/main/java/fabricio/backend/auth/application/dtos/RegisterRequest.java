package fabricio.backend.auth.application.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        @Size(max = 254, message = "Email không được vượt quá 254 ký tự")
        String email,
        @NotBlank(message = "Username không được để trống")
        @Size(min = 3, max = 30, message = "Username phải có từ 3 đến 30 ký tự")
        @Pattern(regexp = "^[a-z0-9]+$", message = "Username chỉ được gồm chữ thường và số")
        String username,
        @NotBlank(message = "Họ tên không được để trống")
        @Size(max = 100, message = "Họ tên không được vượt quá 100 ký tự")
        String fullName,
        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, max = 64, message = "Mật khẩu phải có từ 6 đến 64 ký tự")
        String password) {
}
