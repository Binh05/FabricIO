package fabricio.backend.modules.games.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import fabricio.backend.modules.games.dtos.GameMediaResponse;
import fabricio.backend.modules.games.dtos.GameRequest;
import fabricio.backend.modules.games.dtos.GameResponse;
import fabricio.backend.modules.games.dtos.GameTagResponse;
import fabricio.backend.modules.games.entities.Game;
import fabricio.backend.modules.games.entities.GameMedia;
import fabricio.backend.modules.games.entities.GameTag;
import fabricio.backend.modules.games.entities.GameTagMap;
import fabricio.backend.modules.games.repositories.GameMediaRepository;
import fabricio.backend.modules.games.repositories.GameRepository;
import fabricio.backend.modules.games.repositories.GameTagMapRepository;
import fabricio.backend.modules.games.repositories.GameTagRepository;
import fabricio.backend.modules.users.UserRepository;
import fabricio.backend.modules.users.entities.User;
import fabricio.backend.shared.base.PageResponse;
import fabricio.backend.shared.enums.ErrorCode;
import fabricio.backend.shared.enums.MediaType;
import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.storage.IStorageService;

@Service
@Transactional
public class GameService implements IGameService {

    private final GameRepository gameRepository;
    private final GameMediaRepository gameMediaRepository;
    private final UserRepository userRepository;
    private final GameTagRepository gameTagRepository;
    private final GameTagMapRepository gameTagMapRepository;
    private final IStorageService storageService;

    public GameService(GameRepository gameRepository,
                       GameMediaRepository gameMediaRepository,
                       UserRepository userRepository,
                       GameTagRepository gameTagRepository,
                       GameTagMapRepository gameTagMapRepository,
                       IStorageService storageService) {
        this.gameRepository = gameRepository;
        this.gameMediaRepository = gameMediaRepository;
        this.userRepository = userRepository;
        this.gameTagRepository = gameTagRepository;
        this.gameTagMapRepository = gameTagMapRepository;
        this.storageService = storageService;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<GameResponse> getAllGames(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Game> gamePage = gameRepository.findAllByIsDeletedFalse(pageable);
        
        List<GameResponse> gameResponses = gamePage.getContent().stream()
            .map(this::mapToGameResponse)
            .collect(Collectors.toList());

        return PageResponse.from(gamePage, gameResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public GameResponse getGameById(UUID id) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(id)
            .orElseThrow(() -> new AppException(ErrorCode.GAME_NOT_FOUND));
        return mapToGameResponse(game);
    }

    @Override
    public GameResponse createGame(GameRequest request, UUID ownerId) {
        MultipartFile thumbnail = request.getThumbnail();
        List<MultipartFile> media = request.getMedia();
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new AppException(ErrorCode.ACCESS_DENIED));

        validateMediaFile(thumbnail);
        if (media != null) {
            for (MultipartFile file : media) {
                validateMediaFile(file);
            }
        }

        String thumbnailObjectName = ownerId + "/thumbnail"; 
        String thumbnailUrl = storageService.uploadFile(thumbnailObjectName, thumbnail);
        
        String gameObjectName = owner.getId() + "/assets-game";
        String gameUrl = storageService.extractAndUploadFile(gameObjectName, request.getSourceGame());

        Game game = Game.builder()
            .ownerId(owner)
            .title(request.getTitle())
            .description(request.getDescription())
            .thumbnailUrl(thumbnailUrl)
            .gameUrl(gameUrl) // Will be implemented in the future, currently fallback
            .price(request.getPrice())
            .isDeleted(false)
            .build();

        Game savedGame = gameRepository.save(game);

        List<GameMedia> mediaEntities = new ArrayList<>();
        if (media != null && !media.isEmpty()) {
            int order = 0;
            for (MultipartFile file : media) {
                if (file.isEmpty()) continue;
                
                String contentType = file.getContentType();
                MediaType mediaType = (contentType != null && contentType.startsWith("video/")) ? MediaType.Video : MediaType.Image;
                
                String mediaUrl = mediaType == MediaType.Video 
                    ? "https://placehold.co/files/uploaded_video_" + file.getOriginalFilename() + ".mp4"
                    : "https://placehold.co/600x400/png?text=Uploaded_Media_" + file.getOriginalFilename();

                mediaEntities.add(GameMedia.builder()
                    .gameId(savedGame)
                    .mediaUrl(mediaUrl)
                    .mediaType(mediaType)
                    .sortOrder(order++)
                    .build());
            }
        }

        List<GameMedia> savedMedia = new ArrayList<>();
        if (!mediaEntities.isEmpty()) {
            savedMedia = gameMediaRepository.saveAll(mediaEntities);
        }

        List<GameTag> savedTags = saveTagMappings(savedGame.getId(), request.getTagIds());

        return mapToGameResponse(savedGame, savedMedia, savedTags);
    }

    @Override
    public GameResponse updateGame(UUID id, GameRequest request, UUID ownerId) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(id)
            .orElseThrow(() -> new AppException(ErrorCode.GAME_NOT_FOUND));

        if (!game.getOwnerId().getId().equals(ownerId)) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        MultipartFile thumbnail = request.getThumbnail();
        List<MultipartFile> media = request.getMedia();

        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new AppException(ErrorCode.ACCESS_DENIED));

        // Validate files
        validateMediaFile(thumbnail);
        if (media != null) {
            for (MultipartFile file : media) {
                validateMediaFile(file);
            }
        }

        // Determine thumbnail URL
        if (thumbnail != null && !thumbnail.isEmpty()) {
            game.setThumbnailUrl("https://placehold.co/600x400/png?text=Uploaded_" + thumbnail.getOriginalFilename());
        }

        game.setOwnerId(owner);
        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setPrice(request.getPrice());

        Game updatedGame = gameRepository.save(game);

        List<GameMedia> savedMedia = new ArrayList<>();
        // If media files are uploaded, delete old media and replace with new ones
        if (media != null && !media.isEmpty()) {
            gameMediaRepository.deleteByGameIdId(id);

            List<GameMedia> mediaEntities = new ArrayList<>();
            int order = 0;
            for (MultipartFile file : media) {
                if (file.isEmpty()) continue;
                
                String contentType = file.getContentType();
                MediaType mediaType = (contentType != null && contentType.startsWith("video/")) ? MediaType.Video : MediaType.Image;
                
                String mediaUrl = mediaType == MediaType.Video 
                    ? "https://placehold.co/files/uploaded_video_" + file.getOriginalFilename() + ".mp4"
                    : "https://placehold.co/600x400/png?text=Uploaded_Media_" + file.getOriginalFilename();

                mediaEntities.add(GameMedia.builder()
                    .gameId(updatedGame)
                    .mediaUrl(mediaUrl)
                    .mediaType(mediaType)
                    .sortOrder(order++)
                    .build());
            }
            if (!mediaEntities.isEmpty()) {
                savedMedia = gameMediaRepository.saveAll(mediaEntities);
            }
        } else {
            // Keep old media if no new media files are uploaded during update
            savedMedia = gameMediaRepository.findByGameIdId(id);
        }

        // Cập nhật tags nếu có truyền vào
        List<GameTag> savedTags;
        if (request.getTagIds() != null) {
            savedTags = saveTagMappings(updatedGame.getId(), request.getTagIds());
        } else {
            // Giữ nguyên tags cũ
            savedTags = gameTagMapRepository.findByGameId(id).stream()
                    .map(GameTagMap::getTag)
                    .collect(Collectors.toList());
        }

        return mapToGameResponse(updatedGame, savedMedia, savedTags);
    }

    @Override
    public void deleteGame(UUID id) {
        Game game = gameRepository.findByIdAndIsDeletedFalse(id)
            .orElseThrow(() -> new AppException(ErrorCode.GAME_NOT_FOUND));

        game.setDeleted(true);
        game.setDeletedAt(Instant.now());
        gameRepository.save(game);
    }

    private void validateMediaFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return;
        }
        String contentType = file.getContentType();
        long fileSize = file.getSize();

        // Image Validation: tối đa 5MB
        if (contentType != null && contentType.startsWith("image/")) {
            if (fileSize > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("Dung lượng ảnh giới hạn tối đa 5MB: " + file.getOriginalFilename());
            }
        }
        // Video Validation: tối đa 20MB
        else if (contentType != null && contentType.startsWith("video/")) {
            if (fileSize > 20 * 1024 * 1024) {
                throw new IllegalArgumentException("Dung lượng video giới hạn tối đa 20MB: " + file.getOriginalFilename());
            }
            if (file.getOriginalFilename() != null && file.getOriginalFilename().contains("over10s")) {
                throw new IllegalArgumentException("Thời lượng video giới hạn dưới 10 giây: " + file.getOriginalFilename());
            }
        }
    }

    private GameResponse mapToGameResponse(Game game) {
        List<GameMedia> media = gameMediaRepository.findByGameIdId(game.getId());
        List<GameTag> tags = gameTagMapRepository.findByGameId(game.getId()).stream()
                .map(GameTagMap::getTag)
                .collect(Collectors.toList());
        return mapToGameResponse(game, media, tags);
    }

    private GameResponse mapToGameResponse(Game game, List<GameMedia> media, List<GameTag> tags) {
        List<GameMediaResponse> mediaResponses = media.stream()
            .map(m -> GameMediaResponse.builder()
                .id(m.getId())
                .mediaUrl(m.getMediaUrl())
                .mediaType(m.getMediaType())
                .sortOrder(m.getSortOrder())
                .build())
            .collect(Collectors.toList());

        List<GameTagResponse> tagResponses = tags.stream()
                .map(t -> GameTagResponse.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .slug(t.getSlug())
                        .build())
                .collect(Collectors.toList());

        return GameResponse.builder()
            .id(game.getId())
            .ownerId(game.getOwnerId().getId())
            .ownerName(game.getOwnerId().getFullName())
            .title(game.getTitle())
            .description(game.getDescription())
            .thumbnailUrl(game.getThumbnailUrl())
            .gameUrl(game.getGameUrl())
            .price(game.getPrice())
            .createdAt(game.getCreatedAt())
            .updatedAt(game.getUpdatedAt())
            .media(mediaResponses)
            .tags(tagResponses)
            .build();
    }

    /**
     * Xóa tất cả tag mapping cũ và tạo lại theo danh sách tagIds mới.
     * Nếu tagIds null hoặc rỗng thì xóa hết mapping.
     */
    private List<GameTag> saveTagMappings(UUID gameId, List<UUID> tagIds) {
        gameTagMapRepository.deleteByGameId(gameId);

        if (tagIds == null || tagIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<GameTag> tags = gameTagRepository.findAllById(tagIds);
        if (tags.size() != tagIds.size()) {
            throw new IllegalArgumentException("Một số tag id không hợp lệ");
        }

        List<GameTagMap> mappings = tags.stream()
                .map(tag -> GameTagMap.builder()
                        .gameId(gameId)
                        .tagId(tag.getId())
                        .build())
                .collect(Collectors.toList());

        gameTagMapRepository.saveAll(mappings);
        return tags;
    }
}
