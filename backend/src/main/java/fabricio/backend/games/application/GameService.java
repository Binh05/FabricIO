package fabricio.backend.games.application;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import fabricio.backend.games.GameApi;
import fabricio.backend.games.GameAsset;
import fabricio.backend.games.web.dto.GameRequest;
import fabricio.backend.shared.storage.ObjectStorage;
import fabricio.backend.users.UserApi;
import fabricio.backend.users.UserSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fabricio.backend.games.application.dtos.*;
import fabricio.backend.games.domain.*;
import fabricio.backend.games.domain.exception.GameErrorCode;
import fabricio.backend.games.domain.exception.GameException;
import fabricio.backend.shared.base.PageResponse;

@Service
@Transactional
public class GameService implements GameApi {

    private final GameRepository gameRepository;
    private final GameTagRepository gameTagRepository;
    private final ObjectStorage storage;
    private final UserApi userApi;

    public GameService(GameRepository gameRepository,
                       GameTagRepository gameTagRepository,
                       ObjectStorage storage,
                       UserApi userApi
    ) {
        this.gameRepository = gameRepository;
        this.gameTagRepository = gameTagRepository;
        this.storage = storage;
        this.userApi = userApi;
    }

    @Transactional(readOnly = true)
    public PageResponse<GameResult> getPagiGames(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Game> gamePage = gameRepository.findByIsDeletedFalseAndTitleContainingIgnoreCaseAndStatus(keyword, GameStatus.Ready, pageable);

        List<Game> games = gamePage.getContent();

        if (games.isEmpty()) {
            return PageResponse.from(gamePage, List.of());
        }

        List<UUID> ids = games.stream()
                .map(Game::getId)
                .toList();

        gameRepository.findAllWithTagsByIdIn(ids);

        List<GameResult> results = games.stream()
                .map(g -> {
                    String videoUrl = storage.publicUrl(g.getVideoKey());
                    String thumbnailUrl = storage.publicUrl(g.getThumbnailUrl());

                    return GameResult.from(g, videoUrl, thumbnailUrl);
                })
                .toList();

        return PageResponse.from(gamePage, results);
    }

    @Transactional(readOnly = true)
    public GameDetailResult getGameById(UUID id) {
        Game game = gameRepository.findByIdOrThrow(id);

        UserSummary owner = userApi.findUserSummaryById(game.getOwnerId())
                .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));

        GameAuthor author = new GameAuthor(
                owner.id(),
                owner.fullName(),
                storage.publicUrl(owner.avatarKey())
        );

        String gameUrl = storage.publicUrl(game.getGameUrl(), "index.html");
        String thumbnailUrl = storage.publicUrl(game.getThumbnailUrl());
        return GameDetailResult.from(game, gameUrl, thumbnailUrl, author);
    }

    @Transactional(readOnly = true)
    public List<GameResult> getMyPublishedGames(UUID ownerId) {
        List<Game> games = gameRepository.findByOwnerIdAndIsDeletedFalseAndStatus(ownerId, GameStatus.Ready);
        return games.stream()
                .map(g -> {
                    String videoUrl = storage.publicUrl(g.getVideoKey());
                    String thumbnailUrl = storage.publicUrl(g.getThumbnailUrl());
                    return GameResult.from(g, videoUrl, thumbnailUrl);
                })
                .collect(Collectors.toList());
    }

    public GameResult uploadDraft(UUID userId, GameRequest req) {
        List<UUID> tagIds = req.tagIds();
        List<GameTag> tags = resolveTagIds(tagIds);

        Game game = Game.createDraft(
            userId,
            req.title(),
            req.description(),
            req.price(),
            new HashSet<>(tags)
        );

        gameRepository.save(game);
        return GameResult.from(game, "", "");
    }

    @Transactional
    public GameResult updateGame(UUID gameId, GameRequest request, UUID ownerId) {
        Game game = gameRepository.findByIdOrThrow(gameId);
        game.assertOwnedBy(ownerId);

        List<GameTag> tags = resolveTagIds(request.tagIds());
        game.updateInfo(
                request.title(),
                request.description(),
                request.price(),
                new HashSet<>(tags)
        );

        String videoUrl = storage.publicUrl(game.getVideoKey());
        String thumbnailUrl = storage.publicUrl(game.getThumbnailUrl());
        return GameResult.from(game, videoUrl, thumbnailUrl);
    }

    public void deleteGame(UUID id, UUID ownerId) {
        Game game = gameRepository.findByIdOrThrow(id);

        game.assertOwnedBy(ownerId);

        game.setDeleted(true);
        game.setDeletedAt(Instant.now());
        gameRepository.save(game);
    }

    public GameResult publishGame(UUID gameId) {
        Game game = gameRepository.findByIdOrThrow(gameId);

        game.markAsReady();

        String videoUrl = storage.publicUrl(game.getVideoKey());
        String thumbnailUrl = storage.publicUrl(game.getThumbnailUrl());
        return GameResult.from(game, videoUrl, thumbnailUrl);
    }

    public GamePlayResponse getGamePlayUrl(UUID gameId) {
        Game game = gameRepository.findByIdOrThrow(gameId);

        String gamePlayUrl = storage.publicUrl(game.getGameUrl(), "index.html");

        return new GamePlayResponse(gamePlayUrl);
    }

    public GameResult getMyGameDraft(UUID ownerId) {
        Game game = gameRepository.findFirstByOwnerIdAndStatusAndIsDeletedFalse(ownerId, GameStatus.Draft)
                .orElse(null);

        if (game == null) return null;

        String videoUrl = storage.publicUrl(game.getVideoKey());
        String thumbnailUrl = storage.publicUrl(game.getThumbnailUrl());
        return GameResult.from(game, videoUrl, thumbnailUrl);
    }

    public void deleteGameDraft(UUID gameId) {
        Game game = gameRepository.findByIdOrThrow(gameId);
        gameRepository.delete(game);
    }

    private List<GameTag> resolveTagIds(List<UUID> tagIds) {
        List<GameTag> tags = Collections.emptyList();

        if (tagIds != null && !tagIds.isEmpty()) {
            tags = gameTagRepository.findAllById(tagIds);
            if (tags.size() != new HashSet<>(tags).size()) {
                throw new GameException(GameErrorCode.GAME_TAG_INVALID);
            }
        }

        return tags;
    }

    @Override
    public void requireOwner(UUID userId, UUID gameId) {
        boolean owner = gameRepository.existsGameByIdAndOwnerIdAndIsDeletedFalse(gameId, userId);
        if (!owner) throw new GameException(GameErrorCode.GAME_ACCESS_DENIED);
    }

    @Nullable
    @Override
    public String switchPlayPrefix(UUID gameId, String prefix) {
        Game game = gameRepository.findByIdOrThrow(gameId);
        String oldKey = game.getGameUrl();
        game.setGameUrl(prefix);
        return oldKey;
    }

    @Nullable
    @Override
    @Transactional
    public String updateMedia(UUID gameId, GameAsset asset, String key) {
        Game game = gameRepository.findByIdOrThrow(gameId);

        return game.updateMedia(asset, key);
    }
}
