import { AuthContext, type AuthContextType } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import type { User } from "@/types/User";
import axios from "axios";
import { useCallback, useContext } from "react";
import { toast } from "sonner";

export const useUser = () => {
  const context = useContext<AuthContextType | null>(AuthContext);

  if (!context) {
    throw new Error("useUser phải được sử dụng bên trong AuthProvider");
  }

  const { setUser } = context;

  const uploadAvatar = useCallback(
    async (formData: FormData) => {
      try {
        const { data } = await userService.uploadAvatar(formData);
        setUser((prev: User | null) => {
          if (!prev) return null;
          return {
            ...prev,
            avatarUrl: data.avatarUrl,
          };
        });
      } catch (error) {
        console.error("Lỗi khi upload avatar", error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;
        toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
      }
    },
    [setUser],
  );

  const fetchMe = async () => {
    try {
      const { data: user } = await userService.fetchMe();

      if (user) setUser(user);
    } catch (error) {
      console.error("Lỗi khi refresh token", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message ?? "Đã xảy ra lỗi. Hãy thử lại!");
    }
  };

  return { uploadAvatar, fetchMe };
};
