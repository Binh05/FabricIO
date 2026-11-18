import { GameContext } from "@/context/GameContext";
import { gameService } from "@/services/gameService";
import type {
  Game,
  GameRatingResult,
  GameRatingResponse,
  GameTag,
  PostGameRequest,
} from "@/types/Game";
import axios from "axios";
import { useCallback, useContext } from "react";
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
  fetchUserGames: (userId: string) => Promise<Game[]>;
  fetchGameById: (id: string) => Promise<Game | undefined>;
  fetchGamePlayUrl: (gameId: string) => Promise<string>;
  upsertGameRating: (
    gameId: string,
    stars: number,
  ) => Promise<GameRatingResult>;
  deleteGameRating: (gameId: string) => Promise<GameRatingResult>;
  fetchMyRating: (gameId: string) => Promise<GameRatingResponse | null>;
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

  const fetchDraftGame = useCallback(async (): Promise<Game | null> => {
    try {
      const res = await gameService.getDraftGame();
      return res.data ?? null;
    } catch (error) {
      console.error("Lỗi khi lấy bản nháp game", error);
      return null;
    }
  }, []);

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

  const fetchGames = useCallback(
    async (keyword: string = "", page: number = 0, size: number = 10) => {
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
    },
    [setGames, setLoading, setTotalElements, setTotalPages],
  );

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

  const fetchUserGames = useCallback(async (userId: string): Promise<Game[]> => {
    try {
      const { data } = await gameService.fetchUserGames(userId);
      return data;
    } catch (error) {
      console.error("Lỗi khi fetch games của user", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi khi tải game của người dùng!");
      return [];
    }
  }, []);

  const fetchGameById = async (id: string): Promise<Game | undefined> => {
    try {
      setLoading(true);
      const { data } = await gameService.getGameById(id);

      setGames((prev) => {
        const existingIndex = prev.findIndex((game) => game.id === data.id);
        if (existingIndex === -1) return [...prev, data];

        return prev.map((game) => (game.id === data.id ? data : game));
      });
      return data;
    } catch (error) {
      console.error("Lỗi khi fetch game by id", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
      return undefined;
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

  const upsertGameRating = useCallback(
    async (
      gameId: string,
      stars: number,
    ): Promise<GameRatingResult> => {
      try {
        const { data } = await gameService.upsertGameRating(gameId, stars);
        setGames((prev) =>
          prev.map((game) =>
            game.id === gameId
              ? { ...game, avgRating: data.avgRating, ratingCount: data.ratingCount }
              : game,
          ),
        );
        return data;
      } catch (error) {
        console.error("Lỗi khi đánh giá game", error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;
        toast.error(message ?? "Đã xảy ra lỗi khi đánh giá game!");
        throw error;
      }
    },
    [setGames],
  );

  const deleteGameRating = useCallback(async (gameId: string): Promise<GameRatingResult> => {
    try {
      const { data } = await gameService.deleteGameRating(gameId);
      setGames((prev) =>
        prev.map((game) =>
          game.id === gameId
            ? { ...game, avgRating: data.avgRating, ratingCount: data.ratingCount }
            : game,
        ),
      );
      return data;
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá game", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi khi xóa đánh giá game!");
      throw error;
    }
  }, [setGames]);

  const fetchMyRating = useCallback(
    async (gameId: string): Promise<GameRatingResponse | null> => {
      try {
        const { data } = await gameService.getMyRating(gameId);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        console.error("Lỗi khi lấy đánh giá của tôi", error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;
        toast.error(message ?? "Đã xảy ra lỗi khi lấy đánh giá!");
        throw error;
      }
    },
    [],
  );

  const fetchGameTags = useCallback(async () => {
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
  }, [setTags]);

  return {
    uploadGame,
    fetchDraftGame,
    createDraft,
    updateGameInfo,
    deleteGameDraft,
    publishGame,
    fetchGames,
    fetchMyGames,
    fetchUserGames,
    fetchGameById,
    fetchGamePlayUrl,
    upsertGameRating,
    deleteGameRating,
    fetchMyRating,
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
