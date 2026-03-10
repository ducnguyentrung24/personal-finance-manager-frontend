import { useState } from "react"
import { useNavigate } from "react-router-dom"

import authAPI from "../../api/auth.api"

function Login() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const res = await authAPI.login(form)

      const token = res.data.token

      localStorage.setItem("token", token)

      navigate("/")

    } catch (error) {

      console.error("Login error:", error)

    }

  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96 space-y-4"
      >

        <h2 className="text-xl font-bold text-center">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2"
          value={form.password}
          onChange={handleChange}
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