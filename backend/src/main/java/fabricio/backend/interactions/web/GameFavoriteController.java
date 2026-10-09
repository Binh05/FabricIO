package fabricio.backend.interactions.web;

import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fabricio.backend.interactions.application.dtos.GameFavoriteResponse;
import fabricio.backend.interactions.application.GameFavoriteService;
import fabricio.backend.shared.jwt.UserPrincipal;
import fabricio.backend.shared.base.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/game/{gameId}/favorite")
@Tag(name = "Favorite Toggle")
@RequiredArgsConstructor
public class GameFavoriteController {
    private final GameFavoriteService gameFavoriteService;

    @PostMapping
    public ApiResponse<GameFavoriteResponse> favoriteToggle(
        @PathVariable UUID gameId,
        @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        var userId = userPrincipal.getId();
        return ApiResponse.success(gameFavoriteService.favoriteGame(gameId, userId));
    }
}