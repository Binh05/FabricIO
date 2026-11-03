import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/BaseResponse";
import type { User } from "@/types/User";

export class userService {
  static async fetchMe(): Promise<ApiResponse<User>> {
    const res = await api.get("/user/me");

    return res.data;
  }
}
