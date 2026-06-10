package fabricio.backend.modules.games.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameTagRequest {
    @NotBlank(message = "Tên tag không được để trống")
    private String name;
}
