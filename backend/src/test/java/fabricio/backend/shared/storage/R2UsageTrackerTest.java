package fabricio.backend.shared.storage;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class R2UsageTrackerTest {
    @Test
    void tracksAddsOverwritesAndDeletesObjects() {
        R2UsageTracker tracker = new R2UsageTracker();

        tracker.registerObject("game.zip", 100);
        assertEquals(100, tracker.getUsedBytes());

        tracker.registerObject("game.zip", 150);
        assertEquals(150, tracker.getUsedBytes());

        tracker.removeObject("game.zip");
        assertEquals(0, tracker.getUsedBytes());
    }

    @Test
    void blocksOnlyWhenUsedPlusRequestExceedsLimit() {
        R2UsageTracker tracker = new R2UsageTracker();
        tracker.registerObject("one.bin", 100);

        assertFalse(tracker.wouldExceedLimit(900, 1000));
        assertTrue(tracker.wouldExceedLimit(901, 1000));
    }

    @Test
    void reservesAndConfirmsActualObjectSize() {
        R2UsageTracker tracker = new R2UsageTracker();

        assertTrue(tracker.tryReserve(
                "avatar.png",
                2 * 1024 * 1024,
                Instant.now().plusSeconds(60),
                5L * 1024 * 1024 * 1024));
        assertEquals(2 * 1024 * 1024, tracker.getReservedBytes());
        assertEquals(1, tracker.getPendingUploadCount());

        tracker.confirmObject("avatar.png", 1024);
        assertEquals(0, tracker.getReservedBytes());
        assertEquals(0, tracker.getPendingUploadCount());
        assertEquals(1024, tracker.getUsedBytes());
    }

    @Test
    void expiresReservationsAndRemovesPendingUpload() {
        R2UsageTracker tracker = new R2UsageTracker();

        assertTrue(tracker.tryReserve(
                "expired.png",
                2 * 1024 * 1024,
                Instant.now().minusSeconds(1),
                5L * 1024 * 1024 * 1024));

        tracker.expireReservations();
        assertEquals(0, tracker.getReservedBytes());
        assertEquals(0, tracker.getPendingUploadCount());
    }
}
