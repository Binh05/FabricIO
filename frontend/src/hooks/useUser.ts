import { AuthContext, type AuthContextType } from "@/context/AuthContext";
import { uploadService } from "@/services/uploadService";
import { userService } from "@/services/userService";
import { UPLOAD_LIMITS } from "@/lib/uploadUtils";
import type { User } from "@/types/User";
import axios from "axios";
import { useCallback, useContext, useState } from "react";
import { toast } from "sonner";

export const useUser = () => {
  const context = useContext<AuthContextType | null>(AuthContext);

  if (!context) {
    throw new Error("useUser phải được sử dụng bên trong AuthProvider");
  }

  const { user, setUser } = context;
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user?.id) {
        toast.error("Không tìm thấy thông tin người dùng!");
        return;
      }

      if (file.size > UPLOAD_LIMITS.USER_AVATAR.maxBytes) {
        toast.error("Ảnh đại diện không được vượt quá 2MB");
        return;
      }

      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!UPLOAD_LIMITS.USER_AVATAR.allowedExtensions.includes(ext)) {
        toast.error("Chỉ chấp nhận định dạng ảnh .png, .jpg, .jpeg");
        return;
      }

      try {
        setIsUploadingAvatar(true);
        setUploadProgress(0);

        const res = await uploadService.uploadAvatar(
          user.id,
          file,
          (progress) => setUploadProgress(progress),
        );

        const newAvatarUrl = res.data.url;

        setUser((prev: User | null) => {
          if (!prev) return null;
          return {
            ...prev,
            avatarUrl: newAvatarUrl,
          };
        });

        toast.success("Cập nhật ảnh đại diện thành công!");
        return newAvatarUrl;
      } catch (error) {
        console.error("Lỗi khi upload avatar", error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;
        toast.error(message ?? "Đã xảy ra lỗi khi tải ảnh đại diện!");
        throw error;
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [user?.id, setUser],
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

  return { uploadAvatar, fetchMe, isUploadingAvatar, uploadProgress };
};
