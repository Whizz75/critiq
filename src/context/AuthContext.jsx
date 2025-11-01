// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react"
import { auth, provider } from "@/lib/firebase"
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const value = { user, login, logout, loading }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
