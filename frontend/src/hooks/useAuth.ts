import { AuthContext } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom"

export const useAuth = () => {
    const navigate =  useNavigate();
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
    }

    const login = useCallback(async (username: string, password: string) => {
        try {
            const { data } = await authService.login(username, password)

            localStorage.setItem("access_token", data.accessToken)
            navigate("/")
        } 
        catch (error) 
        {
        }
    }, [navigate])

    const signOut = useCallback(async () => {
        try {
            await authService.signOut()

            localStorage.clear()
            navigate("/")
        } catch (error) {
            
        }
    }, [navigate])

    return { token: context.token, loading: context.loading, login, signOut }
}