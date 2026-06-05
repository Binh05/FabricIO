package fabricio.backend.modules.games.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameRequest {
    @NotBlank(message = "Thiếu tên game")
    private String title;

    private String description;
    
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @NotBlank(message = "Source game không được để trống")
    private MultipartFile sourceGame;

    @NotBlank(message = "Thumbnail game không được để trống")
    private MultipartFile thumbnail;
    private List<MultipartFile> media;

    private List<UUID> tagIds;
}
