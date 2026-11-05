package fabricio.backend.auth.domain;

import static org.junit.jupiter.api.Assertions.*;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class SessionTest {

    @Test
    @DisplayName("Session.create: khởi tạo đúng thông tin userId, token và expiresAt")
    void create_setsFieldsCorrectly() {
        UUID userId = UUID.randomUUID();
        String token = "test-token";
        Duration ttl = Duration.ofDays(7);

        Instant before = Instant.now();
        Session session = Session.create(userId, token, ttl);
        Instant after = Instant.now();

        assertEquals(userId, session.getUserId());
        assertEquals(token, session.getToken());
        assertNotNull(session.getExpiresAt());
        assertTrue(session.getExpiresAt().isAfter(before.plus(Duration.ofDays(6))));
        assertTrue(session.getExpiresAt().isBefore(after.plus(Duration.ofDays(8))));
    }

    @Test
    @DisplayName("isExpired: trả về true khi thời gian hết hạn ở quá khứ")
    void isExpired_returnsTrueWhenExpired() {
        Session session = new Session();
        session.setExpiresAt(Instant.now().minusSeconds(10));

        assertTrue(session.isExpired());
    }

    @Test
    @DisplayName("isExpired: trả về false khi thời gian hết hạn ở tương lai")
    void isExpired_returnsFalseWhenNotExpired() {
        Session session = new Session();
        session.setExpiresAt(Instant.now().plusSeconds(3600));

        assertFalse(session.isExpired());
    }
}
