package fabricio.backend.games.application.dtos;

import fabricio.backend.games.domain.Game;
import fabricio.backend.games.domain.GameTag;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GameResult(
        UUID id,
        UUID ownerId,
        String title,
        String description,
        String thumbnailUrl,
        BigDecimal price,
        List<GameTag> tags,
        double avgRating,
        Instant createdAt,
        Instant updatedAt
) {
    public static GameResult from(Game game) {
        if (game == null) return null;
        return new GameResult(
                game.getId(),
                game.getOwnerId(),
                game.getTitle(),
                game.getDescription(),
                game.getThumbnailUrl(),
                game.getPrice(),
                List.copyOf(game.getTags()),
                game.getAvgRating(),
                game.getCreatedAt(),
                game.getUpdatedAt()
        );
    }
}
