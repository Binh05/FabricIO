package fabricio.backend.games.web.dto;

import fabricio.backend.games.application.dtos.GameResult;
import fabricio.backend.games.domain.Game;
import fabricio.backend.games.domain.GameTag;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GameResponse(
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
    public static GameResponse from(GameResult game) {
        if (game == null) return null;
        return new GameResponse(
                game.id(),
                game.ownerId(),
                game.title(),
                game.description(),
                game.thumbnailUrl(),
                game.price(),
                List.copyOf(game.tags()),
                game.avgRating(),
                game.createdAt(),
                game.updatedAt()
        );
    }
}
