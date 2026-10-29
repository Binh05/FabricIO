package fabricio.backend.upload.application;

import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.exceptions.ErrorCode;
import fabricio.backend.shared.storage.ObjectMeta;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.shared.storage.PresignedUpload;
import fabricio.backend.shared.storage.StorageProperties;
import fabricio.backend.upload.application.dtos.CompleteCommand;
import fabricio.backend.upload.application.dtos.CompleteResult;
import fabricio.backend.upload.application.dtos.PresignCommand;
import fabricio.backend.upload.application.dtos.PresignResult;
import fabricio.backend.upload.domain.UploadPurpose;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UploadService {
    private final ObjectStorage storage;
    private final ObjectKeyFactory keys;
    private final StorageProperties props;
    private final Map<UploadPurpose, UploadPurposeHandler> handlers = new EnumMap<>(UploadPurpose.class);

    public UploadService(
            ObjectStorage storage,
            ObjectKeyFactory keys,
            StorageProperties props,
            List<UploadPurposeHandler> handlerList
    ) {
        this.storage = storage;
        this.keys = keys;
        this.props = props;
        handlerList.forEach(h -> h.purposes().forEach(purpose -> handlers.put(purpose, h)));
    }

    public PresignResult presign(UUID userId, PresignCommand cmd) {
        UploadPurpose purpose = cmd.purpose();
        UUID objectId = resolveObjectId(userId, cmd.objectId(), purpose);

        if (!purpose.allow(cmd.contentType())) throw new AppException(ErrorCode.CONTENT_TYPE_NOT_SUPPORTED);
        if (cmd.size() > purpose.maxByte()) throw new AppException(ErrorCode.MAX_FILE_UPLOAD_EXCEEDED);

        String key = keys.newKey(objectId, cmd.purpose(), cmd.contentType());

        PresignedUpload upload = storage.presignUpload(key, cmd.contentType(), cmd.size(), props.presignTtl());
        return new PresignResult(key, upload);
    }

    public CompleteResult complete(UUID userId, CompleteCommand cmd) {
        String key = cmd.key();
        UploadPurpose purpose = cmd.purpose();
        UUID objectId = resolveObjectId(userId, cmd.objectId(), purpose);

        if (!keys.belongsTo(key, objectId, purpose)) throw new AppException(ErrorCode.BAD_REQUEST);
        ObjectMeta meta = storage.head(key).orElseThrow(() -> new AppException(ErrorCode.BAD_REQUEST));

        if (meta.size() > purpose.maxByte() || !purpose.allow(meta.contentType())) {
            storage.delete(key);
            throw new AppException(ErrorCode.BAD_REQUEST);
        }

        String objectUrl = handler(purpose).onComplete(objectId, cmd.key());
        return new CompleteResult(objectUrl);
    }

    private UUID resolveObjectId(UUID userId, UUID objectId, UploadPurpose purpose) {
        if (purpose.isUserScoped()) return userId;
        if (objectId == null) throw new AppException(ErrorCode.BAD_REQUEST);
        return objectId;
    }

    private UploadPurposeHandler handler(UploadPurpose purpose) {
        UploadPurposeHandler h = handlers.get(purpose);
        if (h == null) throw new AppException(ErrorCode.BAD_REQUEST);
        return h;
    }
}