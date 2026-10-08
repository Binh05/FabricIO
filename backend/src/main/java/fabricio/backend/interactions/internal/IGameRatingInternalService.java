package fabricio.backend.interactions.internal;

import java.util.UUID;

public interface IGameRatingInternalService {
    public GameRatingAVG getRatingAvgByGameId(UUID gameId);
}
