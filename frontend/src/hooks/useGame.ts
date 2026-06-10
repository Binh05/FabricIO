import { GameContext } from "@/context/GameContext";
import { gameService } from "@/services/gameService";
import type { PostGameRequest } from "@/types/Game";
import { useContext } from "react";
import { toast } from "sonner";

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame phải được sử dụng bên trong GameProvider");
  }

  const { games, setGames, loading, setLoading } = context;

  const uploadGame = async (formData: PostGameRequest) => {
    try {
      const { data } = await gameService.uploadGame(formData);

      setGames((prev) => [...prev, data]);
    } catch (error) {
      console.error("Lỗi khi upload games", error);
      toast.error(
        error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
      );
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data } = await gameService.fetchGames();

      setGames(data.content);
    } catch (error) {
      console.error("Lỗi khi fetch games", error);
      toast.error(
        error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
      );
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
      toast.error(
        error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
      );
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
      toast.error(
        error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
      );
    }
  };

  return {
    uploadGame,
    fetchGames,
    fetchGameById,
    fetchGamePlayUrl,
    games,
    setGames,
    loading,
    setLoading,
  };
};
