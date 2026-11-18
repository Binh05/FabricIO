package fabricio.backend.auth.application.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        @Size(max = 254, message = "Email không được vượt quá 254 ký tự")
        String email,
        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, max = 64, message = "Mật khẩu phải có từ 6 đến 64 ký tự")
        String password) {
}
