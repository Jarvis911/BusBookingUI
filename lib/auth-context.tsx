"use client"

import * as React from "react"
import { User } from "./types"
import { login as apiLogin, logout as apiLogout, isLoggedIn } from "./api"

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [loading, setLoading] = React.useState(true)

    // Check auth status on mount
    React.useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser && isLoggedIn()) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse stored user:", e)
            }
        }
        setLoading(false)
    }, [])

    const login = async (username: string, password: string) => {
        const response = await apiLogin(username, password)
        setUser(response.user)
        localStorage.setItem("user", JSON.stringify(response.user))

        // Dispatch custom event to trigger bell shake and notification popup
        window.dispatchEvent(new CustomEvent('user-logged-in', {
            detail: { username: response.user.username }
        }))
    }

    const logout = () => {
        apiLogout()
        setUser(null)
        localStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user && isLoggedIn(),
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
