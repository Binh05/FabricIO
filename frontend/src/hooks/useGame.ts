import { GameContext } from "@/context/GameContext";
import { gameService } from "@/services/gameService";
import type { Game, GameTag, PostGameRequest } from "@/types/Game";
import axios from "axios";
import { useContext } from "react";
import { toast } from "sonner";

interface UseGame {
  uploadGame: (formData: PostGameRequest) => Promise<void>;
  fetchGames: (keyword?: string, page?: number, size?: number) => Promise<void>;
  fetchGameById: (id: string) => Promise<void>;
  fetchGamePlayUrl: (gameId: string) => Promise<string>;
  fetchGameTags: () => Promise<void>;
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  tags: GameTag[];
  tagLoading: boolean;
  totalPages: number;
  totalElements: number;
}

export const useGame = (): UseGame => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame phải được sử dụng bên trong GameProvider");
  }

  const {
    games,
    setGames,
    loading,
    setLoading,
    tags,
    setTags,
    tagLoading,
    totalPages,
    setTotalPages,
    totalElements,
    setTotalElements,
  } = context;

  const uploadGame = async (formData: PostGameRequest) => {
    try {
      const { data } = await gameService.uploadGame(formData);

      setGames((prev) => [...prev, data]);
    } catch (error) {
      console.error("Lỗi khi upload games", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
    }
  };

  const fetchGames = async (
    keyword: string = "",
    page: number = 0,
    size: number = 10,
  ) => {
    try {
      setLoading(true);
      const { data } = await gameService.fetchGames(keyword, page, size);

      setGames(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Lỗi khi fetch games", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const fetchGameById = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await gameService.getGameById(id);

      setGames((prev) => [...prev, data]);
    } catch (error) {
      console.error("Lỗi khi fetch game by id", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const fetchGamePlayUrl = async (gameId: string) => {
    try {
      const { data } = await gameService.getGamePlay(gameId);

      return data.gamePlayUrl;
    } catch (error) {
      console.error("Lỗi khi fetch game by id", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
      throw error;
    }
  };

  const fetchGameTags = async () => {
    try {
      const { data } = await gameService.getGameTags();

      setTags(data);
    } catch (error) {
      console.error("Lỗi khi fetch tags game", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
    }
  };

  return {
    uploadGame,
    fetchGames,
    fetchGameById,
    fetchGamePlayUrl,
    fetchGameTags,
    games,
    setGames,
    loading,
    setLoading,
    tags,
    tagLoading,
    totalPages,
    totalElements,
  };
};
