import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Wallet,
  Tags,
  BarChart3,
  Users
} from "lucide-react"

function Sidebar() {

  const userRaw = localStorage.getItem("user")
  const user = userRaw ? JSON.parse(userRaw) : null

  const menu = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Categories", path: "/categories", icon: Tags },
    { name: "Transactions", path: "/transactions", icon: Wallet },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    ...(user?.role === "admin"
      ? [{ name: "Users", path: "/users", icon: Users }]
      : [])
  ]

  return (
    <nav className="p-4 flex flex-col gap-2">

      {menu.map((item) => {

        const Icon = item.icon

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`
            }
          >
            <Icon size={18} />
            {item.name}
          </NavLink>
        )

      })}

    </nav>
  )
}

export default Sidebar