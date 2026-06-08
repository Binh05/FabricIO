import { userService } from "@/services/userService";
import type { User } from "@/types/User";
import { createContext, useEffect, useState } from "react";

interface AuthContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  clearAuthState: () => void;
}

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const accToken = localStorage.getItem("access_token");
      if (accToken) {
        setToken(accToken);

        if (!user) {
          const { data: user } = await userService.fetchMe();
          console.log(user);
          setUser(user);
        }
      }

      setLoading(false);
    };

    initData();
  }, []);

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    setLoading(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, loading, clearAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
};
