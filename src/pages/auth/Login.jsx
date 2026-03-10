import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import authAPI from "../../api/auth.api"
import { AuthContext } from "../../context/AuthContext"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { fetchUser } = useContext(AuthContext)

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const res = await authAPI.login({
        email,
        password
      })

      const { token } = res.data

      localStorage.setItem("token", token)
      await fetchUser()

      toast.success("Đăng nhập thành công")

      navigate("/")

    } catch (error) {

      console.error(error)

      const status = error?.response?.status

      if (status === 403) {
        toast.error("Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên")
      } else {
        toast.error("Email hoặc mật khẩu không đúng")
      }

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg px-3 py-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border rounded-lg px-3 py-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Login
        </button>

      </form>

    </div>

  )
}

export default Login