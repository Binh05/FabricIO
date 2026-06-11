import { AuthContext } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { useCallback, useContext } from "react";
import { toast } from "sonner";

export const useUser = () => {
  const context = useContext(AuthContext);
  const { setUser } = context;

  if (!context) {
    throw new Error("useUser phải được sử dụng bên trong AuthProvider");
  }

  const uploadAvatar = useCallback(
    async (formData: FormData) => {
      try {
        const { data } = await userService.uploadAvatar(formData);
        setUser((prev) => ({
          ...prev,
          avatarUrl: data.avatarUrl,
        }));
      } catch (error) {
        console.error("Lỗi khi upload avatar", error);
        toast.error(
          error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
        );
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
      toast.error(
        error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
      );
    }
  };

  return { uploadAvatar, fetchMe };
};
