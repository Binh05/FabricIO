package fabricio.backend.games.domain;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import fabricio.backend.games.GameAsset;
import fabricio.backend.games.domain.exception.GameErrorCode;
import fabricio.backend.games.domain.exception.GameException;

class GameTest {

    private UUID ownerId;
    private Game game;

    @BeforeEach
    void setUp() {
        ownerId = UUID.randomUUID();
        game = Game.createDraft(
                ownerId,
                "Cyberpunk 2077",
                "Action RPG",
                BigDecimal.valueOf(59.99),
                new HashSet<>()
        );
    }

    // ==================== CREATE DRAFT ====================

    @Test
    @DisplayName("createDraft: tạo draft game với các thông tin hợp lệ")
    void createDraft_validData_setsStatusDraft() {
        assertEquals(ownerId, game.getOwnerId());
        assertEquals("Cyberpunk 2077", game.getTitle());
        assertEquals("Action RPG", game.getDescription());
        assertEquals(BigDecimal.valueOf(59.99), game.getPrice());
        assertEquals(GameStatus.Draft, game.getStatus());
    }

    @Test
    @DisplayName("createDraft: ném TITLE_REQUIRED khi title null hoặc rỗng")
    void createDraft_blankTitle_throwsException() {
        GameException ex1 = assertThrows(GameException.class, () ->
                Game.createDraft(ownerId, null, "desc", BigDecimal.ZERO, null)
        );
        assertEquals(GameErrorCode.TITLE_REQUIRED.name(), ex1.getCode());

        GameException ex2 = assertThrows(GameException.class, () ->
                Game.createDraft(ownerId, "   ", "desc", BigDecimal.ZERO, null)
        );
        assertEquals(GameErrorCode.TITLE_REQUIRED.name(), ex2.getCode());
    }

    @Test
    @DisplayName("createDraft: ném PRICE_NOT_NEGATIVE khi giá âm hoặc null")
    void createDraft_negativePrice_throwsException() {
        GameException ex1 = assertThrows(GameException.class, () ->
                Game.createDraft(ownerId, "Title", "desc", null, null)
        );
        assertEquals(GameErrorCode.PRICE_NOT_NEGATIVE.name(), ex1.getCode());

        GameException ex2 = assertThrows(GameException.class, () ->
                Game.createDraft(ownerId, "Title", "desc", BigDecimal.valueOf(-1), null)
        );
        assertEquals(GameErrorCode.PRICE_NOT_NEGATIVE.name(), ex2.getCode());
    }

    // ==================== OWNERSHIP ====================

    @Test
    @DisplayName("isOwnedBy / assertOwnedBy: đúng owner thì pass, sai owner ném GAME_ACCESS_DENIED")
    void ownership_checks() {
        assertTrue(game.isOwnedBy(ownerId));
        assertDoesNotThrow(() -> game.assertOwnedBy(ownerId));

        UUID stranger = UUID.randomUUID();
        assertFalse(game.isOwnedBy(stranger));

        GameException ex = assertThrows(GameException.class, () -> game.assertOwnedBy(stranger));
        assertEquals(GameErrorCode.GAME_ACCESS_DENIED.name(), ex.getCode());
    }

    // ==================== MARK AS READY ====================

    @Test
    @DisplayName("markAsReady: chuyển status thành Ready khi có đủ thumbnailUrl và gameUrl")
    void markAsReady_withAssets_success() {
        game.setThumbnailUrl("thumb.png");
        game.setGameUrl("games/play");

        game.markAsReady();

        assertEquals(GameStatus.Ready, game.getStatus());
        assertNotNull(game.getUpdatedAt());
    }

    @Test
    @DisplayName("markAsReady: ném GAME_REQUIRE_NULL khi thiếu thumbnail hoặc gameUrl")
    void markAsReady_missingAssets_throwsException() {
        game.setThumbnailUrl(null);
        game.setGameUrl("games/play");

        GameException ex1 = assertThrows(GameException.class, () -> game.markAsReady());
        assertEquals(GameErrorCode.GAME_REQUIRE_NULL.name(), ex1.getCode());

        game.setThumbnailUrl("thumb.png");
        game.setGameUrl("");

        GameException ex2 = assertThrows(GameException.class, () -> game.markAsReady());
        assertEquals(GameErrorCode.GAME_REQUIRE_NULL.name(), ex2.getCode());
    }

    // ==================== UPDATE MEDIA ====================

    @Test
    @DisplayName("updateMedia: cập nhật thumbnail và video, trả về key cũ")
    void updateMedia_success() {
        game.setThumbnailUrl("old-thumb.png");
        game.setVideoKey("old-video.mp4");

        String oldThumb = game.updateMedia(GameAsset.THUMBNAIL, "new-thumb.png");
        assertEquals("old-thumb.png", oldThumb);
        assertEquals("new-thumb.png", game.getThumbnailUrl());

        String oldVideo = game.updateMedia(GameAsset.VIDEO, "new-video.mp4");
        assertEquals("old-video.mp4", oldVideo);
        assertEquals("new-video.mp4", game.getVideoKey());
    }

    @Test
    @DisplayName("updateMedia: ném ASSET_TYPE_INVALID khi asset là null")
    void updateMedia_nullAsset_throwsException() {
        GameException ex = assertThrows(GameException.class, () -> game.updateMedia(null, "key"));
        assertEquals(GameErrorCode.ASSET_TYPE_INVALID.name(), ex.getCode());
    }

    // ==================== UPDATE INFO ====================

    @Test
    @DisplayName("updateInfo: cập nhật thành công title, description, price, tags")
    void updateInfo_success() {
        GameTag tag = GameTag.builder().name("RPG").build();
        tag.setId(UUID.randomUUID());

        game.updateInfo("New Title", "New Desc", BigDecimal.valueOf(19.99), Set.of(tag));

        assertEquals("New Title", game.getTitle());
        assertEquals("New Desc", game.getDescription());
        assertEquals(BigDecimal.valueOf(19.99), game.getPrice());
        assertEquals(1, game.getTags().size());
    }

    @Test
    @DisplayName("updateInfo: ném ngoại lệ khi giá âm hoặc title trống")
    void updateInfo_validationExceptions() {
        GameException ex1 = assertThrows(GameException.class, () ->
                game.updateInfo("Title", "Desc", BigDecimal.valueOf(-5), null)
        );
        assertEquals(GameErrorCode.PRICE_NOT_NEGATIVE.name(), ex1.getCode());

        GameException ex2 = assertThrows(GameException.class, () ->
                game.updateInfo("", "Desc", BigDecimal.ZERO, null)
        );
        assertEquals(GameErrorCode.TITLE_REQUIRED.name(), ex2.getCode());
    }
}
