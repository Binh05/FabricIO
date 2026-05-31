package fabricio.backend.modules.interactions.controllers;

import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import fabricio.backend.modules.auth.jwt.UserPrincipal;
import fabricio.backend.modules.interactions.dtos.GameRatingRequest;
import fabricio.backend.modules.interactions.dtos.GameRatingResponse;
import fabricio.backend.modules.interactions.services.IGameRatingService;
import fabricio.backend.shared.base.ApiResponse;
import fabricio.backend.shared.base.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/game/{gameId}/ratings")
@Tag(name = "Game Rating", description = "Các api quản lý đánh giá game")
public class GameRatingController {

    private final IGameRatingService gameRatingService;

    public GameRatingController(IGameRatingService gameRatingService) {
        this.gameRatingService = gameRatingService;
    }

    @PostMapping
    @Operation(summary = "Tạo hoặc cập nhật đánh giá cho game (Upsert)")
    public ApiResponse<GameRatingResponse> upsertRating(
            @PathVariable UUID gameId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody GameRatingRequest request) {
        return ApiResponse.success(gameRatingService.upsertRating(gameId, userPrincipal.getId(), request));
    }

    @DeleteMapping
    @Operation(summary = "Xóa đánh giá của người dùng hiện tại đối với game")
    public ApiResponse<Void> deleteRating(
            @PathVariable UUID gameId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        gameRatingService.deleteRating(gameId, userPrincipal.getId());
        return ApiResponse.noContent();
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách đánh giá của game (phân trang)")
    public ApiResponse<PageResponse<GameRatingResponse>> getGameRatings(
            @PathVariable UUID gameId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(gameRatingService.getGameRatingsByGame(gameId, page, size));
    }
}
