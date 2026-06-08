import { AuthContext } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import type { RegisterForm } from "@/types/Auth";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom"

export const useAuth = () => {
    const navigate =  useNavigate();
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
    }

    const signUp = useCallback(async (formData: RegisterForm) => {
        try {
            await authService.resgister(formData)
            navigate("/signin")
        } catch (error) {
            
        }
    }, [navigate])

    const login = useCallback(async (username: string, password: string) => {
        try {
            const { data } = await authService.login({username, password})

            context.setToken(data.accessToken)
            localStorage.setItem("access_token", data.accessToken)

            const { data: user } = await userService.fetchMe()
            context.setUser(user)

            navigate("/")
        } 
        catch (error) 
        {
        }
    }, [navigate])

    const signOut = useCallback(async () => {
        try {
            await authService.signOut()

            context.setToken(null)
            localStorage.clear()
            navigate("/")
        } catch (error) {
            
        }
    }, [navigate])

    return { user: context.user, token: context.token, loading: context.loading, login, signOut, signUp }
}