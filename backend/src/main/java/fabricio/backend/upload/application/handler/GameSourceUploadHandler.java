package fabricio.backend.upload.application.handler;

import fabricio.backend.games.GameApi;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.upload.application.ZipExtractor;
import fabricio.backend.upload.domain.UploadPurpose;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GameSourceUploadHandler implements UploadPurposeHandler {
    private final ObjectStorage storage;
    private final GameApi gameApi;
    private final ZipExtractor zipExtractor;

    public Set<UploadPurpose> purposes() {
        return Set.of(UploadPurpose.GAME_SOURCE);
    }

    public void authorize(UUID userId, UUID gameId) {
        gameApi.requireOwner(userId, gameId);
    }

    public String onComplete(UploadPurpose purpose, UUID userId, UUID gameId, String key) {
        String destPrefix = "game/" + gameId + "/play/" + UUID.randomUUID() + "/";

        zipExtractor.extract(key, destPrefix);
        gameApi.switchPlayPrefix(gameId, destPrefix);

        storage.delete(key);

        return storage.publicUrl(destPrefix + "index.html");
    }
}
