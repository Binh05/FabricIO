package fabricio.backend.modules.games.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fabricio.backend.modules.games.dtos.GameTagRequest;
import fabricio.backend.modules.games.dtos.GameTagResponse;
import fabricio.backend.modules.games.services.IGameTagService;
import fabricio.backend.shared.base.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/game-tags")
@Tag(name = "Game Tag", description = "Các api quản lý tag (category) của game")
public class GameTagController {

    private final IGameTagService gameTagService;

    public GameTagController(IGameTagService gameTagService) {
        this.gameTagService = gameTagService;
    }

    @GetMapping
    public ApiResponse<List<GameTagResponse>> getAllTags() {
        return ApiResponse.success(gameTagService.getAllTags());
    }

    @GetMapping("/{id}")
    public ApiResponse<GameTagResponse> getTagById(@PathVariable UUID id) {
        return ApiResponse.success(gameTagService.getTagById(id));
    }

    @PostMapping
    public ApiResponse<GameTagResponse> createTag(@Valid @RequestBody GameTagRequest request) {
        return ApiResponse.success(gameTagService.createTag(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<GameTagResponse> updateTag(
            @PathVariable UUID id,
            @Valid @RequestBody GameTagRequest request) {
        return ApiResponse.success(gameTagService.updateTag(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTag(@PathVariable UUID id) {
        gameTagService.deleteTag(id);
        return ApiResponse.noContent();
    }
}
