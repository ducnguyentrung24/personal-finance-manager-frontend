import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">

      <div className="p-6 text-xl font-bold border-b">
        Finance Manager
      </div>

      <nav className="p-4 space-y-3">

        <Link to="/" className="block hover:text-blue-600">
          Dashboard
        </Link>

        <Link to="/transactions" className="block hover:text-blue-600">
          Transactions
        </Link>

        <Link to="/categories" className="block hover:text-blue-600">
          Categories
        </Link>

        <Link to="/reports" className="block hover:text-blue-600">
          Reports
        </Link>

        <Link to="/users" className="block hover:text-blue-600">
          Users
        </Link>

      </nav>

    </div>
  )
}

export default Sidebar