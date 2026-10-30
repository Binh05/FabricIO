package fabricio.backend.games.web;

import java.util.UUID;

import fabricio.backend.games.application.GameService;
import fabricio.backend.games.application.dtos.GameResult;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import fabricio.backend.shared.security.UserPrincipal;
import fabricio.backend.games.application.dtos.GamePlayResponse;
import fabricio.backend.games.application.dtos.GameRequest;
import fabricio.backend.games.web.dto.GameResponse;
import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.base.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/games")
@Tag(name = "Game", description = "Các api quản lý game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public ApiResponse<PageResponse<GameResponse>> getAllGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword) {
        PageResponse<GameResponse> res = gameService.getAllGames(page, size, keyword)
                .map(GameResponse::from);
        return ApiResponse.success(res);
    }

    @GetMapping("/{id}")
    public ApiResponse<GameResponse> getGameById(@PathVariable UUID id) {
        return ApiResponse.success(GameResponse.from(gameService.getGameById(id)));
    }

    @PreAuthorize("hasAuthority('GAME_CREATE')")
    @PostMapping("/draft")
    public ApiResponse<GameResponse> uploadGame(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody GameRequest request)
    {
        return ApiResponse.success(GameResponse.from(gameService.uploadDraft(principal.getId(), request)));
    }

    @PreAuthorize("hasAuthority('GAME_CREATE')")
    @PostMapping("/{gameId}/publish")
    public ApiResponse<GameResponse> publishGame(@PathVariable UUID gameId) {
        return ApiResponse.success(GameResponse.from(gameService.publishGame(gameId)));
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

    @PreAuthorize("hasAuthority('GAME_DELETE_OWN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteGame(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        UUID userId = userPrincipal.getId();
        gameService.deleteGame(id, userId);
        return ApiResponse.noContent();
    }

    @GetMapping("/{gameId}/play")
    public ApiResponse<GamePlayResponse> getGamePlayUrl(@PathVariable UUID gameId) {
        return ApiResponse.success(gameService.getGamePlayUrl(gameId));
    }
}
