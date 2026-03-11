import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/layout/Sidebar"
import Header from "../components/layout/Header"

function MainLayout() {

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="h-screen bg-gray-100 flex flex-col">

      <div className="bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 h-16 gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden inline-flex flex-col items-center justify-center w-9 h-9 rounded-lg border border-gray-200"
            aria-label="Open menu"
          >
            <span className="w-4 h-px bg-gray-700 block" />
            <span className="w-4 h-px bg-gray-700 block mt-1" />
            <span className="w-4 h-px bg-gray-700 block mt-1" />
          </button>
          <span className="text-lg sm:text-xl font-bold">Finance Manager</span>
        </div>
        <div className="flex-1 flex justify-end min-w-0">
          <Header />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        <aside className="hidden lg:block bg-white border-r border-gray-200 w-64 overflow-y-auto">
          <Sidebar />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">

          <main className="p-4 sm:p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>

      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 h-16 border-b">
              <span className="text-lg font-bold">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-500"
              >
                Đóng
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

    </div>
  )
}

export default MainLayout