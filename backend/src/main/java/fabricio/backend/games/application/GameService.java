package fabricio.backend.games.application;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

import fabricio.backend.games.GameApi;
import fabricio.backend.games.GameAsset;
import fabricio.backend.games.web.dto.GameResponse;
import fabricio.backend.shared.storage.ObjectStorage;
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

    public GameService(GameRepository gameRepository,
                       GameTagRepository gameTagRepository,
                       ObjectStorage storage
    ) {
        this.gameRepository = gameRepository;
        this.gameTagRepository = gameTagRepository;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public PageResponse<GameResult> getAllGames(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Game> gamePage = gameRepository.findByIsDeletedFalseAndTitleContainingIgnoreCase(keyword, pageable);
        
        List<GameResult> gameResponses = gamePage.getContent().stream()
            .map(GameResult::from)
            .collect(Collectors.toList());

        return PageResponse.from(gamePage, gameResponses);
    }

    @Transactional(readOnly = true)
    public GameResult getGameById(UUID id) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(id)
            .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));
        return GameResult.from(game);
    }

    public GameResult uploadDraft(UUID userId, GameRequest req) {
        List<UUID> tagIds = req.tagIds();
        List<GameTag> tags = Collections.emptyList();

        if (tagIds != null && !tagIds.isEmpty()) {
            tags = gameTagRepository.findAllById(tagIds);
            if (tags.size() != new HashSet<>(tags).size()) {
                throw new GameException(GameErrorCode.GAME_TAG_INVALID);
            }
        }

        Game game = Game.createDraft(
            userId,
            req.title(),
            req.description(),
            req.price(),
            new HashSet<>(tags)
        );

        gameRepository.save(game);
        return GameResult.from(game);
    }

    public GameResponse updateGame(UUID id, GameRequest request, UUID ownerId) {
//        Game game = gameRepository.findByIdAndIsDeletedFalse(id)
//            .orElseThrow(() -> new AppException(ErrorCode.GAME_NOT_FOUND));
//
//        game.assertOwnedBy(ownerId);
//
//        MultipartFile thumbnail = request.getThumbnail();
//        List<MultipartFile> media = request.getMedia();
//
//        // Validate files
//        validateMediaFile(thumbnail);
//        if (media != null) {
//            for (MultipartFile file : media) {
//                validateMediaFile(file);
//            }
//        }
//
//        // Determine thumbnail URL
//        if (thumbnail != null && !thumbnail.isEmpty()) {
//            game.setThumbnailUrl("https://placehold.co/600x400/png?text=Uploaded_" + thumbnail.getOriginalFilename());
//        }
//
//        game.setOwnerId(ownerId);
//        game.setTitle(request.getTitle());
//        game.setDescription(request.getDescription());
//        game.setPrice(request.getPrice());
//
//        Game updatedGame = gameRepository.save(game);
//
//        List<GameMedia> savedMedia = new ArrayList<>();
//        // If media files are uploaded, delete old media and replace with new ones
//        if (media != null && !media.isEmpty()) {
//            gameMediaRepository.deleteByGameIdId(id);
//
//            List<GameMedia> mediaEntities = new ArrayList<>();
//            int order = 0;
//            for (MultipartFile file : media) {
//                if (file.isEmpty()) continue;
//
//                String contentType = file.getContentType();
//                MediaType mediaType = (contentType != null && contentType.startsWith("video/")) ? MediaType.Video : MediaType.Image;
//
//                String mediaUrl = mediaType == MediaType.Video
//                    ? "https://placehold.co/files/uploaded_video_" + file.getOriginalFilename() + ".mp4"
//                    : "https://placehold.co/600x400/png?text=Uploaded_Media_" + file.getOriginalFilename();
//
//                mediaEntities.add(GameMedia.builder()
//                    .gameId(updatedGame)
//                    .mediaUrl(mediaUrl)
//                    .mediaType(mediaType)
//                    .sortOrder(order++)
//                    .build());
//            }
//            if (!mediaEntities.isEmpty()) {
//                savedMedia = gameMediaRepository.saveAll(mediaEntities);
//            }
//        } else {
//            // Keep old media if no new media files are uploaded during update
//            savedMedia = gameMediaRepository.findByGameIdId(id);
//        }
//
//        // Cập nhật tags nếu có truyền vào
//        List<GameTag> savedTags;
//        if (request.getTagIds() != null) {
//            savedTags = saveTagMappings(updatedGame.getId(), request.getTagIds());
//        } else {
//            // Giữ nguyên tags cũ
//            savedTags = gameTagMapRepository.findByGameId(id).stream()
//                    .map(GameTagMap::getTag)
//                    .collect(Collectors.toList());
//        }

       // return mapToGameResponse(updatedGame, savedMedia, savedTags, game.getAvgRating());
        return null;
    }

    public void deleteGame(UUID id, UUID ownerId) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(id)
            .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));

        game.assertOwnedBy(ownerId);

        game.setDeleted(true);
        game.setDeletedAt(Instant.now());
        gameRepository.save(game);
    }

    public GameResult publishGame(UUID gameId) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(gameId)
                .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));

        game.markAsReady();

        return GameResult.from(game);
    }

    public GamePlayResponse getGamePlayUrl(UUID gameId) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(gameId)
            .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));

        String gamePlayUrl = storage.publicUrl(game.getGameUrl()) + "/index.html";

        return new GamePlayResponse(gamePlayUrl);
    }

//    /**
//     * Xóa tất cả tag mapping cũ và tạo lại theo danh sách tagIds mới.
//     * Nếu tagIds null hoặc rỗng thì xóa hết mapping.
//     */
//    private List<GameTag> saveTagMappings(UUID gameId, List<UUID> tagIds) {
//        gameTagMapRepository.deleteByGameId(gameId);
//
//        if (tagIds == null || tagIds.isEmpty()) {
//            return new ArrayList<>();
//        }
//
//        List<GameTag> tags = gameTagRepository.findAllById(tagIds);
//        if (tags.size() != tagIds.size()) {
//            throw new AppException(ErrorCode.GAME_TAG_INVALID);
//        }
//
//        List<GameTagMap> mappings = tags.stream()
//                .map(tag -> GameTagMap.builder()
//                        .gameId(gameId)
//                        .tagId(tag.getId())
//                        .build())
//                .collect(Collectors.toList());
//
//        gameTagMapRepository.saveAll(mappings);
//        return tags;
//    }

    @Override
    public void requireOwner(UUID userId, UUID gameId) {
        boolean owner = gameRepository.existsGameByIdAndOwnerIdAndIsDeletedFalse(gameId, userId);
        if (!owner) throw new GameException(GameErrorCode.GAME_ACCESS_DENIED);
    }

    @Nullable
    @Override
    public String switchPlayPrefix(UUID gameId, String prefix) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(gameId)
                .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));
        String oldKey = game.getGameUrl();
        game.setGameUrl(prefix);
        return oldKey;
    }

    @Nullable
    @Override
    @Transactional
    public String updateMedia(UUID gameId, GameAsset asset, String key) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(gameId)
                .orElseThrow(() -> new GameException(GameErrorCode.GAME_NOT_FOUND));

        return game.updateMedia(asset, key);
    }
}
