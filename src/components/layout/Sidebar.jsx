import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Wallet,
  Tags,
  BarChart3,
  Users
} from "lucide-react"

function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: Wallet },
    { name: "Categories", path: "/categories", icon: Tags },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Users", path: "/users", icon: Users }
  ]

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">

      <div className="p-6 text-xl font-bold border-b">
        Finance Manager
      </div>

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

    </div>
  )
}

export default Sidebar