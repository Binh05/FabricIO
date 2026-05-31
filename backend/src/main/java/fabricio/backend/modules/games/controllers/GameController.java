package fabricio.backend.modules.games.controllers;

import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fabricio.backend.modules.auth.jwt.UserPrincipal;
import fabricio.backend.modules.games.dtos.GameRequest;
import fabricio.backend.modules.games.dtos.GameResponse;
import fabricio.backend.modules.games.services.IGameService;
import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.base.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/games")
@Tag(name = "Game", description = "Các api quản lý game")
public class GameController {

    private final IGameService gameService;

    public GameController(IGameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public ApiResponse<PageResponse<GameResponse>> getAllGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(gameService.getAllGames(page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<GameResponse> getGameById(@PathVariable UUID id) {
        return ApiResponse.success(gameService.getGameById(id));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ApiResponse<GameResponse> createGame(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @ModelAttribute GameRequest request) 
    {
        UUID ownerId = userPrincipal.getId();
        return ApiResponse.success(gameService.createGame(request, ownerId));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ApiResponse<GameResponse> updateGame(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @ModelAttribute GameRequest request) 
    {
        UUID ownerId = userPrincipal.getId();
        return ApiResponse.success(gameService.updateGame(id, request, ownerId));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteGame(@PathVariable UUID id) {
        gameService.deleteGame(id);
        return ApiResponse.noContent();
    }
}
