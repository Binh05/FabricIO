package fabricio.backend.modules.interactions.dtos;

import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameRatingResponse {
    private UUID id;
    private UUID gameId;
    private String gameTitle;
    private UUID userId;
    private String username;
    private int stars;
    private String review;
    private Instant createdAt;
}
