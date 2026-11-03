import { GameContext } from "@/context/GameContext";
import { gameService } from "@/services/gameService";
import type { Game, GameTag, PostGameRequest } from "@/types/Game";
import axios from "axios";
import { useContext } from "react";
import { toast } from "sonner";

interface UseGame {
  uploadGame: (formData: PostGameRequest) => Promise<Game | undefined>;
  fetchDraftGame: () => Promise<Game | null>;
  createDraft: (data: PostGameRequest) => Promise<Game>;
  updateGameInfo: (gameId: string, data: PostGameRequest) => Promise<Game>;
  deleteGameDraft: (gameId: string) => Promise<void>;
  publishGame: (gameId: string) => Promise<Game>;
  fetchGames: (keyword?: string, page?: number, size?: number) => Promise<void>;
  fetchMyGames: () => Promise<Game[]>;
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

  const fetchDraftGame = async (): Promise<Game | null> => {
    try {
      const res = await gameService.getDraftGame();
      return res.data ?? null;
    } catch (error) {
      console.error("Lỗi khi lấy bản nháp game", error);
      return null;
    }
  };

  const createDraft = async (data: PostGameRequest): Promise<Game> => {
    try {
      const res = await gameService.createDraft(data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi tạo draft", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi khi tạo bản nháp!");
      throw error;
    }
  };

  const updateGameInfo = async (
    gameId: string,
    data: PostGameRequest,
  ): Promise<Game> => {
    try {
      const res = await gameService.updateGameInfo(gameId, data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin game", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi khi cập nhật bản nháp!");
      throw error;
    }
  };

  const deleteGameDraft = async (gameId: string): Promise<void> => {
    try {
      await gameService.deleteGameDraft(gameId);
    } catch (error) {
      console.error("Lỗi khi xóa bản nháp game", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi khi xóa bản nháp!");
      throw error;
    }
  };

  const publishGame = async (gameId: string): Promise<Game> => {
    try {
      const res = await gameService.publishGame(gameId);
      setGames((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi xuất bản game", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi khi xuất bản game!");
      throw error;
    }
  };

  const uploadGame = async (formData: PostGameRequest) => {
    try {
      const res = await gameService.uploadGame(formData);
      setGames((prev) => [...prev, res.data]);
      return res.data;
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

  const fetchMyGames = async (): Promise<Game[]> => {
    try {
      const { data } = await gameService.fetchMyGames();
      return data;
    } catch (error) {
      console.error("Lỗi khi fetch my games", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
      return [];
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
    fetchDraftGame,
    createDraft,
    updateGameInfo,
    deleteGameDraft,
    publishGame,
    fetchGames,
    fetchMyGames,
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
