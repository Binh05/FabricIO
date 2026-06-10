import { AuthContext } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import type { RegisterForm } from "@/types/Auth";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }

  const signUp = useCallback(
    async (formData: RegisterForm) => {
      try {
        await authService.resgister(formData);

        navigate("/signin");
        toast.success("Đăng ký thành công");
      } catch (error) {
        console.error("Lỗi khi signup", error);
        toast.error(
          error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
        );
      }
    },
    [navigate],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        sessionStorage.clear();
        context.clearAuthState();

        const { data } = await authService.login({ username, password });

        context.setToken(data.accessToken);
        sessionStorage.setItem("access_token", data.accessToken);

        const { data: user } = await userService.fetchMe();
        context.setUser(user);

        navigate("/");
        toast.success("Đăng nhập thành công");
      } catch (error) {
        console.error("Lỗi khi signin", error);
        toast.error(
          error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
        );
      }
    },
    [navigate],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.signOut();

      sessionStorage.clear();
      context.clearAuthState();

      navigate("/");
      toast.success("Đã đăng xuất");
    } catch (error) {
      console.error("Lỗi khi sign out", error);
      toast.error(
        error?.response?.data?.message ?? "Đã xảy ra lỗi. Hãy thử lại!",
      );
    }
  }, [navigate]);

  return {
    user: context.user,
    token: context.token,
    loading: context.loading,
    login,
    signOut,
    signUp,
  };
};
