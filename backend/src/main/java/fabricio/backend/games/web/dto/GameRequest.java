package fabricio.backend.games.web.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GameRequest (
    @NotBlank(message = "Thiếu tên game")
    @Size(max = 150, message = "Tên game tối đa 150 ký tự")
    String title,
    @Size(max = 2000, message = "Mô tả tối đa 2000 ký tự")
    String description,
    @DecimalMin(value = "0", message = "Giá không được âm")
    @DecimalMax(value = "999", message = "Giá tối đa 999")
    @Digits(integer = 3, fraction = 2, message = "Giá chỉ được tối đa 2 chữ số thập phân")
    BigDecimal price,
    @Size(max = 20, message = "Game chỉ được có tối đa 20 tag")
    List<UUID> tagIds
) {
    public GameRequest {
        if (price == null) {
            price = BigDecimal.ZERO;
        }
    }
}