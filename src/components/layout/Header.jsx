import { useContext, useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

function Header() {

  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const menuRef = useRef()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  // đóng dropdown khi click ra ngoài
  useEffect(() => {

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [])

  return (
    <header className="bg-white border-b px-6 h-16 flex items-center justify-between">

      <h1 className="text-lg font-semibold">
        Personal Finance Manager
      </h1>

      {/* USER DROPDOWN */}
      <div className="relative" ref={menuRef}>

        <button
          onClick={() => setOpen(!open)}
          className="text-right"
        >

          <p className="font-medium">
            {user?.name || "User"}
          </p>

          <p className="text-sm text-gray-500">
            {user?.email}
          </p>

        </button>

        {/* DROPDOWN MENU */}

        {open && (

          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md">

            <button
              onClick={() => navigate("/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Xem tài khoản
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </header>
  )
}

export default Header