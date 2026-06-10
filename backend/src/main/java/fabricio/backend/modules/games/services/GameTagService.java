package fabricio.backend.modules.games.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fabricio.backend.modules.games.dtos.GameTagRequest;
import fabricio.backend.modules.games.dtos.GameTagResponse;
import fabricio.backend.modules.games.entities.GameTag;
import fabricio.backend.modules.games.repositories.GameTagRepository;

@Service
@Transactional
public class GameTagService implements IGameTagService {

    private final GameTagRepository gameTagRepository;

    public GameTagService(GameTagRepository gameTagRepository) {
        this.gameTagRepository = gameTagRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GameTagResponse> getAllTags() {
        return gameTagRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GameTagResponse getTagById(UUID id) {
        GameTag tag = gameTagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag không tìm thấy với id: " + id));
        return mapToResponse(tag);
    }

    @Override
    public GameTagResponse createTag(GameTagRequest request) {
        if (gameTagRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Tên tag đã tồn tại: " + request.getName());
        }

        GameTag tag = GameTag.builder()
                .name(request.getName())
                .build();

        return mapToResponse(gameTagRepository.save(tag));
    }

    @Override
    public GameTagResponse updateTag(UUID id, GameTagRequest request) {
        GameTag tag = gameTagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag không tìm thấy với id: " + id));

        if (gameTagRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new IllegalArgumentException("Tên tag đã tồn tại: " + request.getName());
        }

        tag.setName(request.getName());

        return mapToResponse(gameTagRepository.save(tag));
    }

    @Override
    public void deleteTag(UUID id) {
        if (!gameTagRepository.existsById(id)) {
            throw new RuntimeException("Tag không tìm thấy với id: " + id);
        }
        gameTagRepository.deleteById(id);
    }

    private GameTagResponse mapToResponse(GameTag tag) {
        return GameTagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .build();
    }
}
