package fabricio.backend.shared.storage;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Component;

@Component
public class R2UsageTracker {
    private final AtomicLong usedBytes = new AtomicLong();
    private final ConcurrentHashMap<String, Long> objectSizes = new ConcurrentHashMap<>();

    public long getUsedBytes() {
        return usedBytes.get();
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

    public void removeObject(String key) {
        Long size = objectSizes.remove(key);
        if (size != null) usedBytes.addAndGet(-size);
    }

    public boolean wouldExceedLimit(long additionalBytes, long limitBytes) {
        if (additionalBytes < 0) return true;
        long current = usedBytes.get();
        return additionalBytes > limitBytes - current;
    }

    public void reset() {
        objectSizes.clear();
        usedBytes.set(0);
    }
}
