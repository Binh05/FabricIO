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
        String thumbnailUrl,
        String gameUrl,
        BigDecimal price,
        List<GameTag> tags,
        double avgRating,
        Instant createdAt,
        Instant updatedAt,
        AuthorDto author
) {
    public static GameDetailResult from(Game game, String gameUrl, String thumbnailUrl, AuthorDto author) {
        if (game == null) return null;
        return new GameDetailResult(
                game.getId(),
                game.getOwnerId(),
                game.getTitle(),
                game.getDescription(),
                thumbnailUrl,
                gameUrl,
                game.getPrice(),
                game.getTags() != null ? List.copyOf(game.getTags()) : List.of(),
                game.getAvgRating(),
                game.getCreatedAt(),
                game.getUpdatedAt(),
                author
        );
    }
}
