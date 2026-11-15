package fabricio.backend.games.application.dtos;

import fabricio.backend.games.domain.Game;
import fabricio.backend.games.domain.GameTag;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GameDetailResult(
        UUID id,
        UUID ownerId,
        String title,
        String description,
        String videoUrl,
        String thumbnailUrl,
        BigDecimal price,
        List<GameTag> tags,
        double avgRating,
        Instant createdAt,
        Instant updatedAt,
        GameAuthor author
) {
    public static GameDetailResult from(Game game, String videoUrl, String thumbnailUrl, GameAuthor author) {
        if (game == null) return null;
        return new GameDetailResult(
                game.getId(),
                game.getOwnerId(),
                game.getTitle(),
                game.getDescription(),
                videoUrl,
                thumbnailUrl,
                game.getPrice(),
                game.getTags() != null ? List.copyOf(game.getTags()) : List.of(),
                game.getAvgRating(),
                game.getCreatedAt(),
                game.getUpdatedAt(),
                author
        );
    }
}
