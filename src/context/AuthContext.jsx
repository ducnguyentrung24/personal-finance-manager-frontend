import { createContext, useEffect, useState } from "react"

import userAPI from "../api/user.api"

export const AuthContext = createContext()

function AuthProvider({ children }) {

  const [user, setUser] = useState(null)

  const fetchUser = async () => {

    try {

      const res = await userAPI.getMe()

      setUser(res.data)
      localStorage.setItem("user", JSON.stringify(res.data))

    } catch (error) {

      console.error("Fetch user error:", error)
      setUser(null)
      localStorage.removeItem("user")

    }

  }

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (token) {
      fetchUser()
    } else {
      setUser(null)
      localStorage.removeItem("user")
    }

  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider