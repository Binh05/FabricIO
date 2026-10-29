package fabricio.backend.games.application.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;

public record GameRequest (
    @NotBlank(message = "Thiếu tên game")
    String title,
    String description,
    BigDecimal price,
    List<UUID> tagIds
) {
    public GameRequest {
        if (price == null) {
            price = BigDecimal.ZERO;
        }
    }
}