package fabricio.backend.games.services;

import java.util.UUID;

import fabricio.backend.games.dtos.GamePlayResponse;
import fabricio.backend.games.dtos.GameRequest;
import fabricio.backend.games.dtos.GameResponse;
import fabricio.backend.shared.base.PageResponse;

public interface IGameService {
    PageResponse<GameResponse> getAllGames(int page, int size, String keywork);
    GameResponse getGameById(UUID id);
    GameResponse createGame(GameRequest request, UUID ownerId);
    GameResponse updateGame(UUID id, GameRequest request, UUID ownerId);
    void deleteGame(UUID id);
    GamePlayResponse getGamePlayUrl(UUID gameId);
}
