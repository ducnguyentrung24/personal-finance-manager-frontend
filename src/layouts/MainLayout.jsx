import Sidebar from "../components/layout/Sidebar"
import Header from "../components/layout/Header"
import { Outlet } from "react-router-dom"

function MainLayout() {
  return (
    <div className="h-screen bg-gray-100 grid grid-cols-[16rem_1fr] grid-rows-[4rem_1fr]">

      <div className="bg-white border-r border-b border-gray-200 flex items-center px-6 text-xl font-bold">
        Finance Manager
      </div>

      <div className="bg-white border-b border-gray-200">
        <Header />
      </div>

      <aside className="bg-white border-r border-gray-200 overflow-y-auto">
        <Sidebar />
      </aside>

      <main className="p-6 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  )
}

export default MainLayout