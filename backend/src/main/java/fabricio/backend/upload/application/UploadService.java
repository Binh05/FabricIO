package fabricio.backend.upload.application;

import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.exceptions.ErrorCode;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.shared.storage.PresignedUpload;
import fabricio.backend.shared.storage.StorageProperties;
import fabricio.backend.upload.domain.PresignCommand;
import fabricio.backend.upload.domain.PresignResult;
import fabricio.backend.upload.domain.UploadPurpose;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UploadService {
    private final ObjectStorage storage;
    private final ObjectKeyFactory keys;
    private final StorageProperties props;

    public UploadService(ObjectStorage storage, ObjectKeyFactory keys, StorageProperties props) {
        this.storage = storage;
        this.keys = keys;
        this.props = props;
    }

    public PresignResult presign(UUID ownerId, PresignCommand cmd) {
        UploadPurpose purpose = cmd.purpose();

        if (!purpose.allow(cmd.contentType())) throw new AppException(ErrorCode.CONTENT_TYPE_NOT_SUPPORTED);
        if (cmd.size() > purpose.maxByte()) throw new AppException(ErrorCode.MAX_FILE_UPLOAD_EXCEEDED);

        String key = keys.newKey(ownerId, cmd.purpose(), cmd.contentType());

        PresignedUpload upload = storage.presignUpload(key, cmd.contentType(), cmd.size(), props.presignTtl());
        return new PresignResult(key, upload);
    }
}
