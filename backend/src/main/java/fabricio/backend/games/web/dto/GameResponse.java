package fabricio.backend.games.web.dto;

import fabricio.backend.games.application.dtos.AuthorDto;
import fabricio.backend.games.application.dtos.GameResult;
import fabricio.backend.games.domain.GameTag;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GameResponse(
    UUID id,
    UUID ownerId,
    AuthorDto author,
    String title,
    String description,
    String videoUrl,
    String thumbnailUrl,
    BigDecimal price,
    List<GameTag> tags,
    double avgRating,
    int ratingCount,
    Instant createdAt,
    Instant updatedAt
) {
    public static GameResponse from(GameResult game) {
        if (game == null) return null;
        return new GameResponse(
                game.id(),
                game.ownerId(),
                game.author() != null ? game.author() : null,
                game.title(),
                game.description(),
                game.videoUrl(),
                game.thumbnailUrl(),
                game.price(),
                game.tags() != null ? List.copyOf(game.tags()) : List.of(),
                game.avgRating(),
                game.ratingCount(),
                game.createdAt(),
                game.updatedAt()
        );
    }
}
