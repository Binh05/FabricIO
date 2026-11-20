package fabricio.backend.games.application;

import java.util.UUID;

import fabricio.backend.games.application.dtos.RatingResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fabricio.backend.games.application.dtos.GameRatingRequest;
import fabricio.backend.games.application.dtos.GameRatingResponse;
import fabricio.backend.games.domain.*;
import fabricio.backend.games.domain.exception.GameErrorCode;
import fabricio.backend.games.domain.exception.GameException;

@Service
@Transactional
public class GameRatingService {

    private final GameRatingRepository gameRatingRepository;
    private final GameRepository gameRepository;

    public GameRatingService(GameRatingRepository gameRatingRepository,
            GameRepository gameRepository) {
        this.gameRatingRepository = gameRatingRepository;
        this.gameRepository = gameRepository;
    }

    @Transactional
    public RatingResult upsertRating(UUID gameId, UUID userId, GameRatingRequest request) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));

        GameRating rating = gameRatingRepository.findByGameIdAndUserId(gameId, userId)
                .orElse(null);

        int stars = request.getStars();
        if (rating == null) {
            rating = GameRating.builder()
                    .userId(userId)
                    .game(game)
                    .stars(stars)
                    .build();
        } else {
            rating.updateStars(stars);
        }

        gameRatingRepository.saveAndFlush(rating);
        syncGameRatingStats(game);
        gameRepository.save(game);
        return new RatingResult(stars, game.getAvgRating(), game.getRatingCount());
    }

    public RatingResult deleteRating(UUID gameId, UUID userId) {
        GameRating rating = gameRatingRepository.findByGameIdAndUserId(gameId, userId)
                .orElseThrow(() -> new GameException(GameErrorCode.RATING_NOT_FOUND));

        Game game = rating.getGame();
        gameRatingRepository.delete(rating);
        gameRatingRepository.flush();
        syncGameRatingStats(game);
        gameRepository.save(game);
        return new RatingResult(0, game.getAvgRating(), game.getRatingCount());
    }

    @Transactional(readOnly = true)
    public GameRatingResponse getMyRating(UUID gameId, UUID userId) {
        if (!gameRepository.existsById(gameId)) {
            throw new GameException(GameErrorCode.GAME_NOT_FOUND);
        }

        return gameRatingRepository.findByGameIdAndUserId(gameId, userId)
                .map(this::mapToResponse)
                .orElse(null);
    }

    private GameRatingResponse mapToResponse(GameRating rating) {
        return GameRatingResponse.builder()
                .stars(rating.getStars())
                .build();
    }

    private void syncGameRatingStats(Game game) {
        int ratingCount = gameRatingRepository.countByGameId(game.getId());
        Double avgRating = gameRatingRepository.getAvgByGameId(game.getId());
        game.updateRatingStats(avgRating == null ? 0D : avgRating, ratingCount);
    }
}
