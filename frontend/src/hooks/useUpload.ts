import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { uploadService } from "@/services/uploadService";
import { normalizeContentType, UPLOAD_LIMITS } from "@/lib/uploadUtils";
import type { UploadPurpose } from "@/types/Upload";

export interface GameUploadFiles {
  thumbnailFile: File | null;
  videoFile: File | null;
  sourceFile: File | null;
}

export const useUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [currentStepText, setCurrentStepText] = useState("");
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [sourceProgress, setSourceProgress] = useState(0);

  const requireAdmin = () => {
    if (user?.role !== "Admin") {
      toast.error("Chỉ Admin mới có thể upload hoặc xuất bản game.");
      return false;
    }
    return true;
  };

  const validateThumbnailFile = (file: File): string | null => {
    if (file.size > UPLOAD_LIMITS.GAME_THUMBNAIL.maxBytes) {
      return "Ảnh đại diện không được vượt quá 2MB";
    }
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!UPLOAD_LIMITS.GAME_THUMBNAIL.allowedExtensions.includes(ext)) {
      return "Chỉ chấp nhận định dạng ảnh .png, .jpg, .jpeg";
    }
    return null;
  };

  const validateVideoFile = (file: File): string | null => {
    if (file.size > UPLOAD_LIMITS.GAME_VIDEO.maxBytes) {
      return "Video giới thiệu không được vượt quá 20MB";
    }
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!UPLOAD_LIMITS.GAME_VIDEO.allowedExtensions.includes(ext)) {
      return "Chỉ chấp nhận định dạng video .mp4, .webm";
    }
    return null;
  };

  const validateSourceFile = (file: File): string | null => {
    if (file.size > UPLOAD_LIMITS.GAME_SOURCE.maxBytes) {
      return "File ZIP source game không được vượt quá 100MB";
    }
    if (!file.name.toLowerCase().endsWith(".zip")) {
      return "Vui lòng tải lên tệp nén định dạng .zip";
    }
    return null;
  };

  const uploadOne = async (
    objectId: string,
    file: File,
    purpose: UploadPurpose,
    onProgress: (percent: number) => void,
  ) => {
    onProgress(10);
    const contentType = normalizeContentType(file, purpose);
    const presignRes = await uploadService.presign({
      objectId,
      purpose,
      contentType,
      size: file.size,
    });

    await uploadService.uploadToStorage(
      presignRes.data.presignedUpload.url,
      file,
      contentType,
      presignRes.data.presignedUpload.headers,
      onProgress,
    );

    await uploadService.complete({
      objectId,
      key: presignRes.data.key,
      purpose,
    });
    onProgress(100);
  };

  const uploadGameFiles = async (
    objectId: string,
    files: GameUploadFiles,
  ): Promise<void> => {
    if (!requireAdmin()) {
      throw new Error("Admin permission required");
    }

    try {
      setIsUploading(true);

      if (files.thumbnailFile) {
        setCurrentStepText("Đang tải ảnh đại diện lên...");
        await uploadOne(
          objectId,
          files.thumbnailFile,
          "GAME_THUMBNAIL",
          setThumbnailProgress,
        );
      }

      if (files.videoFile) {
        setCurrentStepText("Đang tải video giới thiệu...");
        await uploadOne(
          objectId,
          files.videoFile,
          "GAME_VIDEO",
          setVideoProgress,
        );
      }

      if (files.sourceFile) {
        setCurrentStepText("Đang tải file build ZIP...");
        await uploadOne(
          objectId,
          files.sourceFile,
          "GAME_SOURCE",
          setSourceProgress,
        );
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Đã xảy ra lỗi trong quá trình tải tệp lên.";
      toast.error(message);
      throw error;
    } finally {
      setIsUploading(false);
      setCurrentStepText("");
    }
  };

  return {
    user,
    isUploading,
    currentStepText,
    thumbnailProgress,
    videoProgress,
    sourceProgress,
    validateThumbnailFile,
    validateVideoFile,
    validateSourceFile,
    uploadGameFiles,
    setStepText: setCurrentStepText,
  };
};
