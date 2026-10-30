package fabricio.backend.upload.application.handler;

import fabricio.backend.games.GameApi;
import fabricio.backend.games.GameAsset;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.exceptions.ErrorCode;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.upload.domain.UploadPurpose;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class GameMediaUploadHandler implements UploadPurposeHandler {
    private final ObjectStorage storage;
    private final GameApi gameApi;

    @Override
    public Set<UploadPurpose> purposes() {
        return Set.of(UploadPurpose.GAME_THUMBNAIL, UploadPurpose.GAME_VIDEO);
    }

    @Override
    public void authorize(UUID userId, UUID gameId) {
        gameApi.requireOwner(userId, gameId);
    }

    @Override
    @Transactional
    public String onComplete(UploadPurpose purpose, UUID userId, UUID gameId, String key) {
        GameAsset asset = resolveGameAsset(purpose);
        String oldKey = gameApi.updateMedia(gameId, asset, key);

        if (key.equals(oldKey)) {
            return storage.publicUrl(key);
        }

        if (oldKey != null && !oldKey.isBlank()) {
            final String toDelete = oldKey;
            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            storage.delete(toDelete);
                        }
                    }
            );
        }

        return storage.publicUrl(key);
    }

    private GameAsset resolveGameAsset(UploadPurpose purpose) {
        return switch(purpose) {
            case GAME_THUMBNAIL -> GameAsset.THUMBNAIL;
            case GAME_VIDEO -> GameAsset.VIDEO;
            default -> throw new AppException(ErrorCode.BAD_REQUEST);
        };
    }
}
