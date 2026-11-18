import { api } from "@/lib/api";
import type { ApiResponse, PageResponse } from "@/types/BaseResponse";
import type {
  Game,
  GameRatingResponse,
  GameRatingResult,
  GamePlayResponse,
  GameTag,
  PostGameRequest,
} from "@/types/Game";

export class gameService {
  static async getDraftGame(): Promise<ApiResponse<Game | null>> {
    const res = await api.get("/games/draft/me");
    return res.data;
  }

  static async createDraft(data: PostGameRequest): Promise<ApiResponse<Game>> {
    const res = await api.post("/games/draft", {
      title: data.title,
      description: data.description,
      price: data.price,
      tagIds: data.tagIds,
    });
    return res.data;
  }

  static async uploadGame(data: PostGameRequest): Promise<ApiResponse<Game>> {
    return this.createDraft(data);
  }

  static async updateGameInfo(
    gameId: string,
    data: PostGameRequest,
  ): Promise<ApiResponse<Game>> {
    const res = await api.put(`/games/${gameId}`, {
      title: data.title,
      description: data.description,
      price: data.price,
      tagIds: data.tagIds,
    });
    return res.data;
  }

  static async deleteGameDraft(gameId: string): Promise<ApiResponse<void>> {
    const res = await api.delete(`/games/${gameId}/draft`);
    return res.data;
  }

  static async publishGame(gameId: string): Promise<ApiResponse<Game>> {
    const res = await api.post(`/games/${gameId}/publish`);
    return res.data;
  }

  static async fetchGames(
    keyword: string = "",
    page: number = 0,
    size: number = 10,
  ): Promise<ApiResponse<PageResponse<Game>>> {
    const res = await api.get(
      `/games?page=${page}&size=${size}&keyword=${keyword}`,
    );

    return res.data;
  }

  static async fetchMyGames(): Promise<ApiResponse<Game[]>> {
    const res = await api.get("/games/me");
    return res.data;
  }

  static async fetchUserGames(userId: string): Promise<ApiResponse<Game[]>> {
    const res = await api.get(`/games/user/${userId}`);
    return res.data;
  }

  static async getGameById(id: string): Promise<ApiResponse<Game>> {
    const res = await api.get(`/games/${id}`);

    return res.data;
  }

  static async getGamePlay(
    gameId: string,
  ): Promise<ApiResponse<GamePlayResponse>> {
    const res = await api.get(`/games/${gameId}/play`);

    return res.data;
  }

  static async upsertGameRating(
    gameId: string,
    stars: number,
  ): Promise<ApiResponse<GameRatingResult>> {
    const res = await api.post(`/game/${gameId}/ratings`, { stars });
    return res.data;
  }

  static async deleteGameRating(
    gameId: string,
  ): Promise<ApiResponse<GameRatingResult>> {
    const res = await api.delete(`/game/${gameId}/ratings`);
    return res.data;
  }

  static async getMyRating(
    gameId: string,
  ): Promise<ApiResponse<GameRatingResponse | null>> {
    const res = await api.get(`/game/${gameId}/ratings/my-rating`);
    return res.data;
  }

  static async getGameTags(): Promise<ApiResponse<GameTag[]>> {
    const res = await api.get("/game-tags");

    return res.data;
  }
}
