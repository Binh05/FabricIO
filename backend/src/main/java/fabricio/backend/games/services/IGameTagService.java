package fabricio.backend.games.services;

import java.util.List;
import java.util.UUID;

import fabricio.backend.games.dtos.GameTagRequest;
import fabricio.backend.games.dtos.GameTagResponse;

public interface IGameTagService {
    List<GameTagResponse> getAllTags();
    GameTagResponse getTagById(UUID id);
    GameTagResponse createTag(GameTagRequest request);
    GameTagResponse updateTag(UUID id, GameTagRequest request);
    void deleteTag(UUID id);
}
