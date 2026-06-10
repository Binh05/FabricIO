import { api } from "@/lib/api";
import type { ApiResponse, PageResponse } from "@/types/BaseResponse";
import type { Game, GamePlayResponse, PostGameRequest } from "@/types/Game";

export class gameService {
  static async uploadGame(data: PostGameRequest): Promise<ApiResponse<Game>> {
    const formData = new FormData();

    formData.append("title", data.title);

    if (data.description) {
      formData.append("description", data.description);
    }

    formData.append("price", data.price.toString());
    formData.append("sourceGame", data.sourceGame, data.sourceGame.name);
    formData.append("thumbnail", data.thumbnail, data.thumbnail.name);

    if (data.media) {
      data.media.forEach((file) => {
        formData.append("media", file, file.name);
      });
    }

    if (data.tagIds) {
      data.tagIds.forEach((id) => {
        formData.append("tagIds", id);
      });
    }

    const res = await api.post("/games", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }

  static async fetchGames(
    page: number = 0,
    size: number = 10,
  ): Promise<ApiResponse<PageResponse<Game>>> {
    const res = await api.get(`/games?page=${page}&size=${size}`);

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
}
