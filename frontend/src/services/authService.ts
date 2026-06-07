import { api } from "@/lib/api"
import type { Login } from "@/types/Auth"
import type { BaseResponse } from "@/types/BaseResponse"

export class authService {
  static async login(username: string, password: string): Promise<BaseResponse<Login>> {
    const res = await api.post("/auth/login", {
      username,
      password
    })

    return res.data
  }

  static async signOut(): Promise<BaseResponse<void>> {
    const res = await api.post("/auth/signout")

    return res.data
  }
}