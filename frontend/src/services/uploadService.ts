import axios from "axios";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/BaseResponse";
import type {
  CompleteCommand,
  CompleteResult,
  PresignCommand,
  PresignResult,
} from "@/types/Upload";

export class uploadService {
  static async presign(
    cmd: PresignCommand,
  ): Promise<ApiResponse<PresignResult>> {
    const res = await api.post("/uploads/presign", cmd);
    return res.data;
  }

  static async uploadToStorage(
    url: string,
    file: File | Blob,
    contentType: string,
    headers?: Record<string, string>,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    const requestHeaders: Record<string, string> = {
      ...(headers ?? {}),
      "Content-Type": contentType,
    };

    await axios.put(url, file, {
      headers: requestHeaders,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        }
      },
    });
  }

  static async complete(
    cmd: CompleteCommand,
  ): Promise<ApiResponse<CompleteResult>> {
    const res = await api.post("/uploads/complete", cmd);
    return res.data;
  }
}

