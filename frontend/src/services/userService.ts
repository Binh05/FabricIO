import { api } from "@/lib/api";
import type { BaseResponse } from "@/types/BaseResponse";
import type { User } from "@/types/User";

export class userService {
    static async fetchMe(): Promise<BaseResponse<User>> {
        const res = await api.get("/user/me")

        return res.data
    }
}