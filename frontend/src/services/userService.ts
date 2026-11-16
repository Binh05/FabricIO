import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/BaseResponse";
import type {
  FetchUserResult,
  User,
  UserUpdateRequest,
} from "@/types/User";

export class userService {
  static async fetchMe(): Promise<ApiResponse<User>> {
    const res = await api.get("/user/me");

    return res.data;
  }

  static async updateProfile(
    request: UserUpdateRequest,
  ): Promise<ApiResponse<User>> {
    const res = await api.patch("/user", request);

    return res.data;
  }

  static async getUserById(id: string): Promise<ApiResponse<FetchUserResult>> {
    const res = await api.get(`/user/${id}`);

    return res.data;
  }
}
