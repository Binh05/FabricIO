package fabricio.backend.games;

import fabricio.backend.games.domain.Game;
import fabricio.backend.games.domain.GameStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record GameSummary(
        UUID id,
        UUID ownerId,
        String title,
        String description,
        String thumbnailUrl,
        String videoKey,
        String gameUrl,
        GameStatus status,
        BigDecimal price,
        int avgRating,
        int ratingCount,
        boolean isDelete,
        Instant createdAt,
        Instant updatedAt
) {
    public static GameSummary from(Game game) {
        if (game == null) {
            return null;
        }

        return new GameSummary(
                game.getId(),
                game.getOwnerId(),
                game.getTitle(),
                game.getDescription(),
                game.getThumbnailUrl(),
                game.getVideoKey(),
                game.getGameUrl(),
                game.getStatus(),
                game.getPrice(),
                game.getAvgRating(),
                game.getRatingCount(),
                game.isDeleted(),
                game.getCreatedAt(),
                game.getUpdatedAt()
        );
    }
}
