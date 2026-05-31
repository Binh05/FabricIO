package fabricio.backend.modules.games.dtos;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameResponse {
    private UUID id;
    private UUID ownerId;
    private String ownerName;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String gameUrl;
    private BigDecimal price;
    private Instant createdAt;
    private Instant updatedAt;
    private List<GameMediaResponse> media;
    private List<GameTagResponse> tags;
}
