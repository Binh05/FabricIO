package fabricio.backend.modules.interactions.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import fabricio.backend.modules.interactions.dtos.GameFavoriteResponse;
import fabricio.backend.modules.interactions.entities.GameFavorite;
import fabricio.backend.modules.interactions.repositories.GameFavoriteRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class GameFavoriteService {
    private final GameFavoriteRepository gameFavoriteRepository;

    public GameFavoriteService(GameFavoriteRepository gameFavoriteRepository) {
        this.gameFavoriteRepository = gameFavoriteRepository;
    }

    public GameFavoriteResponse favoriteGame(UUID gameId, UUID userId) {
        var favorEntity = gameFavoriteRepository.findByGameId(gameId)
            .orElse(null);

        if (favorEntity == null) {
            GameFavorite gameFavorite = new GameFavorite();
            gameFavorite.setUserId(userId);
            gameFavorite.setGameId(gameId);

            gameFavoriteRepository.save(gameFavorite);
            return new GameFavoriteResponse(true);
        }

        gameFavoriteRepository.delete(favorEntity);

        return new GameFavoriteResponse(false);
    } 
}