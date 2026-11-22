package fabricio.backend.upload.domain;

import java.time.Duration;
import java.util.Set;

public enum UploadPurpose {
    USER_AVATAR(OwnerType.USER, "avatars", Rules.IMAGES, 2 * Rules.MB, Duration.ofSeconds(60), 2 * Rules.MB),
    GAME_THUMBNAIL(OwnerType.GAME, "thumbnails", Rules.IMAGES, 2 * Rules.MB, Duration.ofSeconds(60), 0),
    GAME_VIDEO(OwnerType.GAME, "videos", Rules.VIDEOS, 10 * Rules.MB, Duration.ofSeconds(300), 0),
    GAME_SOURCE(OwnerType.GAME, "sources", Rules.ZIPS, 100 * Rules.MB, Duration.ofSeconds(600), 0);

    public enum OwnerType {
        USER("users"), GAME("games");

        private final String root;

        OwnerType(String root) {
            this.root = root;
        }

        public String root() {
            return root;
        }
    }

    private static final class Rules {
        static long MB = 1024 * 1024;
        static Set<String> IMAGES = Set.of("image/png", "image/jpeg", "image/jpg");
        static Set<String> VIDEOS = Set.of("video/mp4", "video/webm");
        static Set<String> ZIPS = Set.of("application/zip", "application/x-zip-compressed");
    }

    private final OwnerType ownerType;
    private final String folder;
    private final Set<String> contentTypes;
    private final long maxByte;
    private final Duration presignTtl;
    private final long reservationBytes;

    UploadPurpose(
            OwnerType ownerType,
            String folder,
            Set<String> contentTypes,
            long maxByte,
            Duration presignTtl,
            long reservationBytes) {
        this.ownerType = ownerType;
        this.folder = folder;
        this.contentTypes = contentTypes;
        this.maxByte = maxByte;
        this.presignTtl = presignTtl;
        this.reservationBytes = reservationBytes;
    }

    public OwnerType ownerType() {
        return ownerType;
    }

    public String folder() {
        return folder;
    }

    public long maxByte() {
        return maxByte;
    }

    public Duration presignTtl() {
        return presignTtl;
    }

    public long reservationBytes() {
        return reservationBytes;
    }

    public boolean isUserScoped() {
        return ownerType == OwnerType.USER;
    }

    public boolean allow(String contentType) {
        return contentTypes.contains(contentType);
    }
}
