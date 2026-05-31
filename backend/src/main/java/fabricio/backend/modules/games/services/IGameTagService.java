package fabricio.backend.modules.games.services;

import java.util.List;
import java.util.UUID;

import fabricio.backend.modules.games.dtos.GameTagRequest;
import fabricio.backend.modules.games.dtos.GameTagResponse;

public interface IGameTagService {
    List<GameTagResponse> getAllTags();
    GameTagResponse getTagById(UUID id);
    GameTagResponse createTag(GameTagRequest request);
    GameTagResponse updateTag(UUID id, GameTagRequest request);
    void deleteTag(UUID id);
}
