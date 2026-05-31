package fabricio.backend.modules.games.services;

import java.util.UUID;
import fabricio.backend.modules.games.dtos.GameRequest;
import fabricio.backend.modules.games.dtos.GameResponse;
import fabricio.backend.shared.base.PageResponse;

public interface IGameService {
    PageResponse<GameResponse> getAllGames(int page, int size);
    GameResponse getGameById(UUID id);
    GameResponse createGame(GameRequest request, UUID ownerId);
    GameResponse updateGame(UUID id, GameRequest request, UUID ownerId);
    void deleteGame(UUID id);
}
