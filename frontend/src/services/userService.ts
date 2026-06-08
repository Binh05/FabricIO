import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/BaseResponse";
import type { UploadAvatarResponse, User } from "@/types/User";

export class userService {
  static async fetchMe(): Promise<ApiResponse<User>> {
    const res = await api.get("/user/me");

    return res.data;
  }

  static async uploadAvatar(
    formData: FormData,
  ): Promise<ApiResponse<UploadAvatarResponse>> {
    const res = await api.post("/user/avatar", formData);

    return res.data;
  }
}
