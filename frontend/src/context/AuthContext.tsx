import { createContext, useEffect, useLayoutEffect, useState } from "react";

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [token, setToken] = useState<string | null>(null)

    useLayoutEffect(() => {
        const token = localStorage.getItem("access_token")
        if (token) {
            setToken(token)
        }
        setLoading(false)
    }, [])

    return <AuthContext.Provider value={{ token, loading }}>
        {children}
    </AuthContext.Provider>
}