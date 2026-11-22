package fabricio.backend.shared.storage;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class R2UsageTracker {
    public record PendingUpload(long size, Instant expiresAt) {}

    private final AtomicLong usedBytes = new AtomicLong();
    private final AtomicLong reservedBytes = new AtomicLong();
    private final ConcurrentHashMap<String, Long> objectSizes = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, PendingUpload> pendingUploads = new ConcurrentHashMap<>();

    public long getUsedBytes() {
        return usedBytes.get();
    }

    public long getReservedBytes() {
        return reservedBytes.get();
    }

    public int getPendingUploadCount() {
        return pendingUploads.size();
    }

    public void initialize(String key, long size) {
        if (size < 0) return;
        Long previous = objectSizes.put(key, size);
        if (previous == null) {
            usedBytes.addAndGet(size);
        } else if (previous != size) {
            usedBytes.addAndGet(size - previous);
        }
    }

    public void registerObject(String key, long size) {
        initialize(key, size);
    }

    public synchronized boolean tryReserve(String key, long size, Instant expiresAt, long limitBytes) {
        if (size < 0) return false;
        long available = limitBytes - usedBytes.get() - reservedBytes.get();
        if (size > available) return false;

        PendingUpload existing = pendingUploads.put(key, new PendingUpload(size, expiresAt));
        if (existing == null) {
            reservedBytes.addAndGet(size);
        } else if (existing.size() != size) {
            reservedBytes.addAndGet(size - existing.size());
        }
        return true;
    }

    public void confirmObject(String key, long size) {
        PendingUpload pending = pendingUploads.remove(key);
        if (pending != null) {
            reservedBytes.addAndGet(-pending.size());
        }
        initialize(key, size);
    }

    @Scheduled(fixedDelay = 60_000)
    public void expireReservations() {
        Instant now = Instant.now();
        pendingUploads.forEach((key, pending) -> {
            if (!pending.expiresAt().isAfter(now)
                    && pendingUploads.remove(key, pending)) {
                reservedBytes.addAndGet(-pending.size());
            }
        });
    }

    public void removeObject(String key) {
        Long size = objectSizes.remove(key);
        if (size != null) usedBytes.addAndGet(-size);
    }

    public boolean wouldExceedLimit(long additionalBytes, long limitBytes) {
        if (additionalBytes < 0) return true;
        long current = usedBytes.get();
        long reserved = reservedBytes.get();
        return additionalBytes > limitBytes - current - reserved;
    }

    public void reset() {
        objectSizes.clear();
        usedBytes.set(0);
        pendingUploads.clear();
        reservedBytes.set(0);
    }
}
