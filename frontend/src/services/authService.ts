import { api } from "@/lib/api"
import type { Login, LoginForm, RegisterForm } from "@/types/Auth"
import type { BaseResponse } from "@/types/BaseResponse"

export class authService {
  static async login({username, password}: LoginForm): Promise<BaseResponse<Login>> {
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

  static async resgister({username, fullName, email, password}: RegisterForm): Promise<BaseResponse<void>> {
    const res = await api.post("/auth/register", {
      email,
      username,
      fullName,
      password
    })

    return res.data
  }
}