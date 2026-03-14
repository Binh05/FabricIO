import { authService } from "@/services/authService";
import {
  clearState,
  setAuth,
  setLoading,
} from "@/store/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

export function useAuth() {
  const dispatch = useAppDispatch();

  async function Login(email: string, password: string) {
    try {
      dispatch(setLoading(true));

      const data = await authService.Login(email, password);

      console.log(data);
      const result = data.data;

      dispatch(setAuth({ user: result.user, token: result.accessToken }));
    } catch (error) {
      console.error("Loi khi dang nhap", error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { Login };
}
