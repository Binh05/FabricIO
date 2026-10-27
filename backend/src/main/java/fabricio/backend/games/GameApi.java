package fabricio.backend.games;

import java.util.UUID;

public interface GameApi {
    void requireOwner(UUID userId, UUID gameId);
    String switchPlayPrefix(UUID gameId, String prefix);
    String updateMedia(UUID gameId, GameAsset asset, String key);
}
