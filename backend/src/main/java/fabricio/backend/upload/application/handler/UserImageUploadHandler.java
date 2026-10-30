package fabricio.backend.upload.application.handler;

import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.exceptions.ErrorCode;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.upload.UpdateAvatarCommand;
import fabricio.backend.upload.domain.UploadPurpose;
import fabricio.backend.users.UserApi;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.Set;
import java.util.UUID;

@Component
public class UserImageUploadHandler implements UploadPurposeHandler {
    private final UserApi userApi;
    private final ObjectStorage storage;

    public UserImageUploadHandler(UserApi userApi, ObjectStorage storage) {
        this.userApi = userApi;
        this.storage = storage;
    }

    @Override
    public Set<UploadPurpose> purposes() {
        return Set.of(UploadPurpose.USER_AVATAR);
    }

    @Override
    public void authorize(UUID userId, UUID objectId) {
        if (!userId.equals(objectId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }
    }

    @Override
    @Transactional
    public String onComplete(UploadPurpose purpose, UUID userId, UUID objectId, String key) {
        String oldKey = userApi.updateAvatar(new UpdateAvatarCommand(userId, key));
        if (key.equals(oldKey)) return storage.publicUrl(oldKey);

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

}
