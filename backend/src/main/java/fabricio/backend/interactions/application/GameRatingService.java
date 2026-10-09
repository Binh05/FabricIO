package fabricio.backend.interactions.application;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import fabricio.backend.interactions.services.IGameRatingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fabricio.backend.games.domain.Game;
import fabricio.backend.games.domain.GameRepository;
import fabricio.backend.interactions.application.dtos.GameRatingRequest;
import fabricio.backend.interactions.application.dtos.GameRatingResponse;
import fabricio.backend.interactions.domain.GameRating;
import fabricio.backend.interactions.GameRatingSummary;
import fabricio.backend.interactions.GameRatingApi;
import fabricio.backend.interactions.domain.GameRatingRepository;
import fabricio.backend.users.domain.UserRepository;
import fabricio.backend.users.domain.User;
import fabricio.backend.shared.base.PageResponse;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;

@Service
@Transactional
public class GameRatingService implements IGameRatingService, GameRatingApi {

    private final GameRatingRepository gameRatingRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public GameRatingService(GameRatingRepository gameRatingRepository,
                             GameRepository gameRepository,
                             UserRepository userRepository) {
        this.gameRatingRepository = gameRatingRepository;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    @Override
    public GameRatingResponse upsertRating(UUID gameId, UUID userId, GameRatingRequest request) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new AppException(ErrorCode.GAME_NOT_FOUND));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        GameRating rating = gameRatingRepository.findByGameIdAndUserId(gameId, userId)
                .orElse(null);

        if (rating == null) {
            rating = GameRating.builder()
                    .game(game)
                    .user(user)
                    .stars(request.getStars())
                    .review(request.getReview())
                    .build();
        } else {
            rating.setStars(request.getStars());
            rating.setReview(request.getReview());
        }

        GameRating savedRating = gameRatingRepository.save(rating);
        return mapToResponse(savedRating);
    }

    @Override
    public void deleteRating(UUID gameId, UUID userId) {
        GameRating rating = gameRatingRepository.findByGameIdAndUserId(gameId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.RATING_NOT_FOUND));

        gameRatingRepository.delete(rating);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<GameRatingResponse> getGameRatingsByGame(UUID gameId, int page, int size) {
        if (!gameRepository.existsById(gameId)) {
            throw new AppException(ErrorCode.GAME_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<GameRating> ratingPage = gameRatingRepository.findByGameId(gameId, pageable);

        List<GameRatingResponse> content = ratingPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.from(ratingPage, content);
    }

    private GameRatingResponse mapToResponse(GameRating rating) {
        return GameRatingResponse.builder()
                .id(rating.getId())
                .gameId(rating.getGame().getId())
                .gameTitle(rating.getGame().getTitle())
                .userId(rating.getUser().getId())
                .username(rating.getUser().getUsername())
                .stars(rating.getStars())
                .review(rating.getReview())
                .createdAt(rating.getCreatedAt())
                .build();
    }

    @Override
    public GameRatingSummary getRatingAvgByGameId(UUID gameId) {
        double avg = gameRatingRepository.getAvgByGameId(gameId);

        return new GameRatingSummary(avg);
    }
}
