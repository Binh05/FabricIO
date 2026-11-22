package fabricio.backend.shared.storage;

import org.junit.jupiter.api.Test;

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
}
