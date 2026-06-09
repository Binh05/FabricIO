import { api } from "@/lib/api";
import type { ApiResponse, PageResponse } from "@/types/BaseResponse";
import type { Game, PostGameRequest } from "@/types/Game";

export class gameService {
  static async uploadGame(
    page: number = 1,
    size: number = 0,
    formData: PostGameRequest,
  ) {
    const res = await api.post(`/games?page=${page}&size=${size}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }

  static async fetchGames(): Promise<ApiResponse<PageResponse<Game>>> {
    const res = await api.get("/games");

    return res.data;
  }

  static async getGameById(id: string): Promise<ApiResponse<Game>> {
    const res = await api.get(`/games/${id}`);

    return res.data;
  }
}
