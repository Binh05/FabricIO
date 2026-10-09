package fabricio.backend.interactions;

import java.util.UUID;

public interface GameRatingApi {
    public GameRatingSummary getRatingAvgByGameId(UUID gameId);
}
