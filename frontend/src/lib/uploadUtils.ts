import type { UploadPurpose } from "@/types/Upload";

export const UPLOAD_LIMITS = {
  USER_AVATAR: {
    maxBytes: 2 * 1024 * 1024, // 2MB
    allowedExtensions: [".png", ".jpg", ".jpeg"],
    allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg"],
    accept: "image/png,image/jpeg,image/jpg",
    label: "PNG, JPG/JPEG (Tối đa 2MB)",
  },
  GAME_THUMBNAIL: {
    maxBytes: 2 * 1024 * 1024, // 2MB
    allowedExtensions: [".png", ".jpg", ".jpeg"],
    allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg"],
    accept: "image/png,image/jpeg,image/jpg",
    label: "PNG, JPG/JPEG (Tối đa 2MB)",
  },
  GAME_VIDEO: {
    maxBytes: 20 * 1024 * 1024, // 20MB
    allowedExtensions: [".mp4", ".webm"],
    allowedMimeTypes: ["video/mp4", "video/webm"],
    accept: "video/mp4,video/webm",
    label: "MP4, WebM (Tối đa 20MB)",
  },
  GAME_SOURCE: {
    maxBytes: 100 * 1024 * 1024, // 100MB
    allowedExtensions: [".zip"],
    allowedMimeTypes: [
      "application/zip",
      "application/x-zip-compressed",
      "application/x-zip",
      "multipart/x-zip",
    ],
    accept: ".zip,application/zip,application/x-zip-compressed",
    label: "Tệp build nén .zip chứa index.html (Tối đa 100MB)",
  },
};

export function normalizeContentType(file: File, purpose: UploadPurpose): string {
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  if (purpose === "GAME_THUMBNAIL" || purpose === "USER_AVATAR") {
    if (type === "image/png" || name.endsWith(".png")) {
      return "image/png";
    }
    return "image/jpeg";
  }

  if (purpose === "GAME_VIDEO") {
    if (type === "video/webm" || name.endsWith(".webm")) {
      return "video/webm";
    }
    return "video/mp4";
  }

  if (purpose === "GAME_SOURCE") {
    if (type === "application/x-zip-compressed") {
      return "application/x-zip-compressed";
    }
    return "application/zip";
  }

  return type || "application/octet-stream";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
