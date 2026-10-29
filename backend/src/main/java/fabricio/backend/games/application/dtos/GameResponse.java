package fabricio.backend.games.application.dtos;

import fabricio.backend.games.domain.Game;
import fabricio.backend.games.domain.GameTag;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public record GameResponse(
    UUID id,
    UUID ownerId,
    String title,
    String description,
    String thumbnailUrl,
    BigDecimal price,
    Instant createdAt,
    Instant updatedAt,
    List<GameTag> tags,
    double ratingAvg
) {
    public static GameResponse from(Game game) {
        if (game == null) return null;
        return new GameResponse(
                game.getId(),
                game.getOwnerId(),
                game.getTitle(),
                game.getDescription(),
                game.getThumbnailUrl(),
                game.getPrice(),
                game.getCreatedAt(),
                game.getUpdatedAt(),
                List.copyOf(game.getTags()),
                game.getAvgRating()
        );
    }
}
