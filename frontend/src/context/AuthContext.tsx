import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import type { User } from "@/types/User";
import { createContext, useEffect, useState } from "react";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  clearAuthState: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        let accessToken: string | null = sessionStorage.getItem("access_token");

        if (!accessToken) {
          const res = await authService.refreshToken();

          accessToken = res.data.accessToken;
        }

        if (accessToken) {
          setToken(accessToken);
          sessionStorage.setItem("access_token", accessToken);
        }

        if (accessToken && !user) {
          const res = await userService.fetchMe();

          setUser(res.data);
        }
      } catch (error) {
        sessionStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        loading,
        setLoading,
        clearAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
