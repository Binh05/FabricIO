package fabricio.backend.games.application;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import fabricio.backend.games.GameAsset;
import fabricio.backend.games.application.dtos.GamePlayResponse;
import fabricio.backend.games.application.dtos.GameResult;
import fabricio.backend.games.domain.*;
import fabricio.backend.games.domain.exception.GameErrorCode;
import fabricio.backend.games.domain.exception.GameException;
import fabricio.backend.games.web.dto.GameRequest;
import fabricio.backend.shared.base.PageResponse;
import fabricio.backend.shared.storage.ObjectStorage;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @Mock
    private GameTagRepository gameTagRepository;

    @Mock
    private ObjectStorage storage;

    @InjectMocks
    private GameService gameService;

    private UUID ownerId;
    private UUID gameId;
    private Game mockGame;

    @BeforeEach
    void setUp() {
        ownerId = UUID.randomUUID();
        gameId = UUID.randomUUID();

        mockGame = Game.builder()
                .ownerId(ownerId)
                .title("Super Game")
                .description("Awesome adventure")
                .price(BigDecimal.valueOf(19.99))
                .status(GameStatus.Ready)
                .thumbnailUrl("thumb/game.png")
                .gameUrl("games/supergame")
                .videoKey("videos/preview.mp4")
                .tags(new HashSet<>())
                .isDeleted(false)
                .build();
        mockGame.setId(gameId);
    }

    // ==================== GET ALL GAMES ====================

    @Test
    @DisplayName("getAllGames: trả về danh sách phân trang khi có kết quả")
    void getAllGames_withContent() {
        Page<Game> page = new PageImpl<>(List.of(mockGame));
        when(gameRepository.findByIsDeletedFalseAndTitleContainingIgnoreCaseAndStatus(
                eq("Super"), eq(GameStatus.Ready), any(Pageable.class)
        )).thenReturn(page);
        when(storage.publicUrl("videos/preview.mp4")).thenReturn("https://storage/preview.mp4");
        when(storage.publicUrl("thumb/game.png")).thenReturn("https://storage/thumb.png");

        PageResponse<GameResult> response = gameService.getAllGames(0, 10, "Super");

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("Super Game", response.getContent().get(0).title());
        assertEquals("https://storage/thumb.png", response.getContent().get(0).thumbnailUrl());
        verify(gameRepository).findAllWithTagsByIdIn(List.of(gameId));
    }

    @Test
    @DisplayName("getAllGames: trả về danh sách rỗng khi không có game nào")
    void getAllGames_empty() {
        Page<Game> emptyPage = new PageImpl<>(Collections.emptyList());
        when(gameRepository.findByIsDeletedFalseAndTitleContainingIgnoreCaseAndStatus(
                anyString(), eq(GameStatus.Ready), any(Pageable.class)
        )).thenReturn(emptyPage);

        PageResponse<GameResult> response = gameService.getAllGames(0, 10, "empty");

        assertNotNull(response);
        assertTrue(response.getContent().isEmpty());
        verify(gameRepository, never()).findAllWithTagsByIdIn(any());
    }

    // ==================== GET GAME BY ID ====================

    @Test
    @DisplayName("getGameById: thành công khi tìm thấy game")
    void getGameById_success() {
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);
        when(storage.publicUrl("videos/preview.mp4")).thenReturn("https://storage/preview.mp4");
        when(storage.publicUrl("thumb/game.png")).thenReturn("https://storage/thumb.png");

        GameResult result = gameService.getGameById(gameId);

        assertNotNull(result);
        assertEquals(gameId, result.id());
        assertEquals("Super Game", result.title());
    }

    // ==================== GET MY PUBLISHED GAMES ====================

    @Test
    @DisplayName("getMyPublishedGames: trả về danh sách game ready của owner")
    void getMyPublishedGames_success() {
        when(gameRepository.findByOwnerIdAndIsDeletedFalseAndStatus(ownerId, GameStatus.Ready))
                .thenReturn(List.of(mockGame));
        when(storage.publicUrl("videos/preview.mp4")).thenReturn("https://storage/preview.mp4");
        when(storage.publicUrl("thumb/game.png")).thenReturn("https://storage/thumb.png");

        List<GameResult> results = gameService.getMyPublishedGames(ownerId);

        assertEquals(1, results.size());
        assertEquals(gameId, results.get(0).id());
    }

    // ==================== UPLOAD DRAFT ====================

    @Test
    @DisplayName("uploadDraft: tạo draft game và lưu vào db")
    void uploadDraft_success() {
        UUID tagId = UUID.randomUUID();
        GameTag tag = GameTag.builder().name("Action").build();
        tag.setId(tagId);

        GameRequest request = new GameRequest("Draft Title", "Draft Desc", BigDecimal.TEN, List.of(tagId));
        when(gameTagRepository.findAllById(List.of(tagId))).thenReturn(List.of(tag));

        GameResult result = gameService.uploadDraft(ownerId, request);

        assertNotNull(result);
        assertEquals("Draft Title", result.title());
        assertEquals("Draft Desc", result.description());
        verify(gameRepository).save(any(Game.class));
    }

    // ==================== UPDATE GAME ====================

    @Test
    @DisplayName("updateGame: cập nhật thông tin game khi là owner")
    void updateGame_success() {
        GameRequest request = new GameRequest("Updated Title", "Updated Desc", BigDecimal.valueOf(25), Collections.emptyList());
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);
        when(storage.publicUrl(mockGame.getVideoKey())).thenReturn("video-url");
        when(storage.publicUrl(mockGame.getThumbnailUrl())).thenReturn("thumb-url");

        GameResult result = gameService.updateGame(gameId, request, ownerId);

        assertNotNull(result);
        assertEquals("Updated Title", mockGame.getTitle());
        assertEquals("Updated Desc", mockGame.getDescription());
        assertEquals(BigDecimal.valueOf(25), mockGame.getPrice());
    }

    @Test
    @DisplayName("updateGame: ném GAME_ACCESS_DENIED khi không phải owner")
    void updateGame_notOwner_throwsException() {
        UUID strangerId = UUID.randomUUID();
        GameRequest request = new GameRequest("New Title", "Desc", BigDecimal.ONE, Collections.emptyList());
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);

        GameException ex = assertThrows(GameException.class, () ->
                gameService.updateGame(gameId, request, strangerId)
        );

        assertEquals(GameErrorCode.GAME_ACCESS_DENIED.name(), ex.getCode());
    }

    // ==================== DELETE GAME ====================

    @Test
    @DisplayName("deleteGame: đánh dấu isDeleted = true khi là owner")
    void deleteGame_success() {
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);

        gameService.deleteGame(gameId, ownerId);

        assertTrue(mockGame.isDeleted());
        assertNotNull(mockGame.getDeletedAt());
        verify(gameRepository).save(mockGame);
    }

    @Test
    @DisplayName("deleteGame: ném GAME_ACCESS_DENIED khi không phải owner")
    void deleteGame_notOwner_throwsException() {
        UUID strangerId = UUID.randomUUID();
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);

        GameException ex = assertThrows(GameException.class, () ->
                gameService.deleteGame(gameId, strangerId)
        );

        assertEquals(GameErrorCode.GAME_ACCESS_DENIED.name(), ex.getCode());
    }

    // ==================== PUBLISH GAME ====================

    @Test
    @DisplayName("publishGame: chuyển trạng thái game thành Ready khi có đủ asset")
    void publishGame_success() {
        mockGame.setStatus(GameStatus.Draft);
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);
        when(storage.publicUrl(mockGame.getVideoKey())).thenReturn("video-url");
        when(storage.publicUrl(mockGame.getThumbnailUrl())).thenReturn("thumb-url");

        GameResult result = gameService.publishGame(gameId);

        assertNotNull(result);
        assertEquals(GameStatus.Ready, mockGame.getStatus());
    }

    @Test
    @DisplayName("publishGame: ném GAME_REQUIRE_NULL khi thiếu thumbnail hoặc gameUrl")
    void publishGame_missingAssets_throwsException() {
        mockGame.setThumbnailUrl(null);
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);

        GameException ex = assertThrows(GameException.class, () ->
                gameService.publishGame(gameId)
        );

        assertEquals(GameErrorCode.GAME_REQUIRE_NULL.name(), ex.getCode());
    }

    // ==================== GET GAME PLAY URL ====================

    @Test
    @DisplayName("getGamePlayUrl: trả về GamePlayResponse với link index.html")
    void getGamePlayUrl_success() {
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);
        when(storage.publicUrl("games/supergame", "index.html")).thenReturn("https://storage/games/supergame/index.html");

        GamePlayResponse response = gameService.getGamePlayUrl(gameId);

        assertNotNull(response);
        assertEquals("https://storage/games/supergame/index.html", response.gamePlayUrl());
    }

    // ==================== GET / DELETE GAME DRAFT ====================

    @Test
    @DisplayName("getMyGameDraft: trả về GameResult khi tìm thấy draft")
    void getMyGameDraft_found() {
        Game draftGame = Game.builder()
                .ownerId(ownerId)
                .title("Draft")
                .status(GameStatus.Draft)
                .isDeleted(false)
                .build();
        draftGame.setId(UUID.randomUUID());

        when(gameRepository.findFirstByOwnerIdAndStatusAndIsDeletedFalse(ownerId, GameStatus.Draft))
                .thenReturn(Optional.of(draftGame));

        GameResult result = gameService.getMyGameDraft(ownerId);

        assertNotNull(result);
        assertEquals("Draft", result.title());
    }

    @Test
    @DisplayName("getMyGameDraft: trả về null khi không có draft")
    void getMyGameDraft_notFound() {
        when(gameRepository.findFirstByOwnerIdAndStatusAndIsDeletedFalse(ownerId, GameStatus.Draft))
                .thenReturn(Optional.empty());

        GameResult result = gameService.getMyGameDraft(ownerId);

        assertNull(result);
    }

    @Test
    @DisplayName("deleteGameDraft: xóa game draft khỏi database")
    void deleteGameDraft_success() {
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);

        gameService.deleteGameDraft(gameId);

        verify(gameRepository).delete(mockGame);
    }

    // ==================== REQUIRE OWNER ====================

    @Test
    @DisplayName("requireOwner: không ném ngoại lệ khi user là owner")
    void requireOwner_isOwner_doesNotThrow() {
        when(gameRepository.existsGameByIdAndOwnerIdAndIsDeletedFalse(gameId, ownerId)).thenReturn(true);

        assertDoesNotThrow(() -> gameService.requireOwner(ownerId, gameId));
    }

    @Test
    @DisplayName("requireOwner: ném GAME_ACCESS_DENIED khi user không phải owner")
    void requireOwner_notOwner_throwsException() {
        when(gameRepository.existsGameByIdAndOwnerIdAndIsDeletedFalse(gameId, ownerId)).thenReturn(false);

        GameException ex = assertThrows(GameException.class, () -> gameService.requireOwner(ownerId, gameId));
        assertEquals(GameErrorCode.GAME_ACCESS_DENIED.name(), ex.getCode());
    }

    // ==================== SWITCH PLAY PREFIX & UPDATE MEDIA ====================

    @Test
    @DisplayName("switchPlayPrefix: cập nhật prefix mới và trả về key cũ")
    void switchPlayPrefix_success() {
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);

        String oldKey = gameService.switchPlayPrefix(gameId, "games/new-prefix");

        assertEquals("games/supergame", oldKey);
        assertEquals("games/new-prefix", mockGame.getGameUrl());
    }

    @Test
    @DisplayName("updateMedia: cập nhật thumbnail và video key")
    void updateMedia_success() {
        when(gameRepository.findByIdOrThrow(gameId)).thenReturn(mockGame);

        String oldThumbnail = gameService.updateMedia(gameId, GameAsset.THUMBNAIL, "thumb/new.png");
        assertEquals("thumb/game.png", oldThumbnail);
        assertEquals("thumb/new.png", mockGame.getThumbnailUrl());

        String oldVideo = gameService.updateMedia(gameId, GameAsset.VIDEO, "videos/new.mp4");
        assertEquals("videos/preview.mp4", oldVideo);
        assertEquals("videos/new.mp4", mockGame.getVideoKey());
    }
}
