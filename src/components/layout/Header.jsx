import { useContext, useMemo, useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

function Header() {

  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)
  const menuRef = useRef()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
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

  const resolvedUser = useMemo(() => {
    if (user) return user

    const cached = localStorage.getItem("user")
    if (!cached) return null

    try {
      return JSON.parse(cached)
    } catch {
      return null
    }
  }, [user])

  return (
    <header className="h-full bg-white flex items-center justify-end px-3 sm:px-6 gap-3 relative z-50">

      <div className="relative pr-2 z-[60] shrink-0" ref={menuRef}>

        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col items-end justify-center h-12 text-right"
        >

          <span className="font-medium text-gray-800 text-sm sm:text-base">
            {resolvedUser?.name || "Tài khoản"}
          </span>

          {resolvedUser?.email && (
            <span className="text-xs sm:text-sm text-gray-500">
              {resolvedUser.email}
            </span>
          )}

        </button>

        {open && (

          <div className="absolute right-0 mt-2 min-w-[150px] bg-white border rounded-lg shadow-md z-[70]">

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