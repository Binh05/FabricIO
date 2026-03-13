import { api } from "@/lib/axios";

async function Login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });

  return res.data;
}

export const authService = {
  Login,
};
