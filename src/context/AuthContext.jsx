import { createContext, useEffect, useState } from "react"

import userAPI from "../api/user.api"

export const AuthContext = createContext()

function AuthProvider({ children }) {

  const [user, setUser] = useState(null)

  const fetchUser = async () => {

    try {

      const res = await userAPI.getMe()

      setUser(res.data)

    } catch (error) {

      console.error("Fetch user error:", error)
      setUser(null)

    }

  }

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (token) {
      fetchUser()
    } else {
      setUser(null)
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