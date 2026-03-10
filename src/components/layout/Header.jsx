import { useContext, useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

function Header() {

  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)
  const menuRef = useRef()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const getTitle = () => {
    if (location.pathname === "/") return "Dashboard"

    const path = location.pathname.replace("/", "")
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

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
    <header className="bg-white border-b h-16 flex items-center justify-between px-6">

      {/* PAGE TITLE */}
      <h1 className="text-lg font-semibold text-gray-800">
        {getTitle()}
      </h1>

      {/* USER AREA */}
      <div className="relative pr-2" ref={menuRef}>

        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col items-center justify-center h-12"
        >

          <span className="font-medium text-gray-800">
            {user?.name}
          </span>

          <span className="text-sm text-gray-500">
            {user?.email}
          </span>

        </button>

        {/* DROPDOWN */}
        {open && (

          <div className="absolute right-0 mt-2 min-w-[150px] bg-white border rounded-lg shadow-md">

            <button
              onClick={() => navigate("/profile")}
              className="block w-full text-left px-3 py-2 whitespace-nowrap hover:bg-gray-100"
            >
              Xem tài khoản
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 whitespace-nowrap text-red-500 hover:bg-gray-100"
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