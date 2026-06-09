package fabricio.backend.modules.interactions.internal;

import java.util.UUID;

public interface IGameRatingInternalService {
    public GameRatingAVG getRatingAvgByGameId(UUID gameId);
}
