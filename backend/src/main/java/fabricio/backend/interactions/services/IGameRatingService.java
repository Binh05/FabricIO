package fabricio.backend.interactions.services;

import java.util.UUID;
import fabricio.backend.interactions.dtos.GameRatingRequest;
import fabricio.backend.interactions.dtos.GameRatingResponse;
import fabricio.backend.shared.base.PageResponse;

public interface IGameRatingService {
    GameRatingResponse upsertRating(UUID gameId, UUID userId, GameRatingRequest request);
    void deleteRating(UUID gameId, UUID userId);
    PageResponse<GameRatingResponse> getGameRatingsByGame(UUID gameId, int page, int size);
}
