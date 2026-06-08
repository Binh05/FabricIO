import { AuthContext } from "@/context/AuthContext"
import { userService } from "@/services/userService"
import { useCallback, useContext } from "react"

export const useUser = () => {
    const context = useContext(AuthContext)
    const { setUser } = context

    if (!context) {
        throw new Error("useUser phải được sử dụng bên trong AuthProvider");
    }

    const uploadAvatar = useCallback(async (formData: FormData) => {
        try {
            const { data } = await userService.uploadAvatar(formData)
            setUser(prev => ({
                ...prev,
                avatarUrl: data.avatarUrl
            }))
        } catch (error) {
            console.error("Lỗi khi upload avatar", error)
        }
    }, [setUser])

    return { uploadAvatar }
}