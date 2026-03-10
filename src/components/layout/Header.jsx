import { useNavigate } from "react-router-dom"

function Header() {

  const navigate = useNavigate()

  const handleLogout = () => {

    localStorage.removeItem("token")

    navigate("/login")

  }

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">

      <h1 className="font-semibold">
        Personal Finance Manager
      </h1>

      <button
        onClick={handleLogout}
        className="text-red-500 hover:text-red-700"
      >
        Logout
      </button>

    </header>
  )
}

export default Header