import Sidebar from "../components/layout/Sidebar"
import Header from "../components/layout/Header"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default MainLayout