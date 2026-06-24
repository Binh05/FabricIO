package fabricio.backend.modules.games;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;

import fabricio.backend.modules.games.dtos.GameRequest;
import fabricio.backend.modules.games.dtos.GameResponse;
import fabricio.backend.modules.games.entities.Game;
import fabricio.backend.modules.games.mappers.IGameMapper;
import fabricio.backend.modules.games.repositories.GameMediaRepository;
import fabricio.backend.modules.games.repositories.GameRepository;
import fabricio.backend.modules.games.repositories.GameTagMapRepository;
import fabricio.backend.modules.games.repositories.GameTagRepository;
import fabricio.backend.modules.games.services.GameService;
import fabricio.backend.modules.interactions.internal.GameRatingAVG;
import fabricio.backend.modules.interactions.internal.IGameRatingInternalService;
import fabricio.backend.modules.users.UserRepository;
import fabricio.backend.modules.users.entities.User;
import fabricio.backend.shared.base.PageResponse;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.mock.UserMockFactory;
import fabricio.backend.shared.storage.IStorageService;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {
    @Mock
    private GameRepository gameRepository;
    @Mock
    private GameMediaRepository gameMediaRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private GameTagRepository gameTagRepository;
    @Mock
    private GameTagMapRepository gameTagMapRepository;
    @Mock
    private IStorageService storageService;
    @Mock
    private IGameRatingInternalService gameRatingInternalService;
    @Mock
    private IGameMapper gameMapper;

    @InjectMocks
    private GameService gameService;

    @Test
    void createGame_shouldSuccess() {
        UUID ownerId = UUID.randomUUID();

        User owner = UserMockFactory.createMockUser();

        MockMultipartFile thumbnail =
            new MockMultipartFile(
                "thumbnail",
                "thumb.png",
                "image/png",
                "abc".getBytes());

        MockMultipartFile source =
            new MockMultipartFile(
                "sourceGame",
                "game.zip",
                "application/zip",
                "zip".getBytes());

        GameRequest request = GameRequest.builder()
            .title("Mario")
            .thumbnail(thumbnail)
            .sourceGame(source)
            .media(Collections.emptyList())
            .tagIds(Collections.emptyList())
            .build();

        when(userRepository.findById(ownerId))
            .thenReturn(Optional.of(owner));

        when(storageService.uploadFile(anyString(), any()))
            .thenReturn("thumb-url");

        when(storageService.extractAndUploadFile(anyString(), any()))
            .thenReturn("game-url");

        Game game = Game.builder()
            .title("Mario")
            .build();

        when(gameMapper.toEntity(any(GameRequest.class)))
            .thenReturn(game);

        Game savedGame = Game.builder()
            .id(UUID.randomUUID())
            .ownerId(owner)
            .title("Mario")
            .thumbnailUrl("thumb-url")
            .gameUrl("game-url")
            .build();

        when(gameRepository.save(any(Game.class)))
            .thenReturn(savedGame);

        when(storageService.getFullUrl(anyString()))
            .thenReturn("full-thumb");

        // when(gameTagRepository.findAllById(any()))
        //     .thenReturn(Collections.emptyList());

        // when(gameTagMapRepository.saveAll(any()))
        //     .thenReturn(Collections.emptyList());

        GameResponse response =
            gameService.createGame(request, ownerId);

        assertNotNull(response);
        assertEquals("Mario", response.getTitle());

        verify(gameMapper).toEntity(any(GameRequest.class));
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    void getAllGames_shouldFilterByKeyword() {
        User mockOwner = UserMockFactory.createMockUser();

        Game game = Game.builder()
            .id(UUID.randomUUID())
            .title("Mario")
            .ownerId(mockOwner)
            .thumbnailUrl("mario-thumb.png")
            .build();

        Page<Game> page =
            new PageImpl<>(List.of(game));

        when(gameRepository
            .findByIsDeletedFalseAndTitleContainingIgnoreCase(
                eq("Mario"),
                any(Pageable.class)
            ))
            .thenReturn(page);

        when(storageService.getFullUrl(any()))
            .thenReturn("thumb");

        when(gameRatingInternalService.getRatingAvgByGameId(any()))
            .thenReturn(new GameRatingAVG(5.0));

        PageResponse<GameResponse> result =
            gameService.getAllGames(
                0,
                10,
                "Mario"
            );

        assertEquals(
            1,
            result.getContent().size()
        );
    }

    @Test
    void getAllGames_shouldReturnPagination() {
        User mockOwner = UserMockFactory.createMockUser();

        List<Game> games = IntStream.range(0, 10)
            .<Game>mapToObj(i ->
                Game.builder()
                    .id(UUID.randomUUID()) // Set ID tuần tự từ 1 đến 10
                    .title("Game " + i)
                    .ownerId(mockOwner)
                    .thumbnailUrl("thumb-" + i + ".png")
                    .build()
            )
            .toList();

        Page<Game> page =
            new PageImpl<>(
                games,
                PageRequest.of(0,10),
                100
            );

        when(gameRepository
            .findByIsDeletedFalseAndTitleContainingIgnoreCase(
                anyString(),
                any(Pageable.class)
            ))
            .thenReturn(page);

        when(gameRatingInternalService.getRatingAvgByGameId(any()))
            .thenReturn(new GameRatingAVG(5));

        when(storageService.getFullUrl(any()))
            .thenReturn("thumb");

        PageResponse<GameResponse> result =
            gameService.getAllGames(
                0,
                10,
                ""
            );

        assertEquals(100, result.getTotalElements());
    }

    @Test
    void getGameById_shouldSuccess() {
        User mockOwner = UserMockFactory.createMockUser();

        UUID id = UUID.randomUUID();

        Game game = Game.builder()
            .id(id)
            .title("Mario")
            .ownerId(mockOwner)
            .thumbnailUrl("mario-thumb.png")
            .build();

        when(gameRepository
            .findByIdAndIsDeletedFalse(id))
            .thenReturn(Optional.of(game));

        when(storageService.getFullUrl(any()))
            .thenReturn("thumb");

        when(gameRatingInternalService.getRatingAvgByGameId(id))
            .thenReturn(new GameRatingAVG(4.5));

        GameResponse result =
            gameService.getGameById(id);

        assertEquals(
            "Mario",
            result.getTitle()
        );
    }

    @Test
    void getGameById_shouldThrowWhenNotFound() {

        UUID id = UUID.randomUUID();

        when(gameRepository
            .findByIdAndIsDeletedFalse(id))
            .thenReturn(Optional.empty());

        AppException ex =
            assertThrows(
                AppException.class,
                () -> gameService.getGameById(id)
            );

        assertEquals(
            ErrorCode.GAME_NOT_FOUND,
            ex.getErrorCode()
        );
    }
}
