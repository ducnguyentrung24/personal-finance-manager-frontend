import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "../layouts/MainLayout"
import ProtectedRoute from "./ProtectedRoute"

import Login from "../pages/auth/Login"
import Dashboard from "../pages/dashboard/Dashboard"
import Transactions from "../pages/transactions/Transactions"
import Categories from "../pages/categories/Categories"
import Reports from "../pages/reports/Reports"
import Users from "../pages/users/Users"
import Profile from "../pages/profile/Profile"

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<Dashboard />} />

          <Route path="transactions" element={<Transactions />} />

          <Route path="categories" element={<Categories />} />

          <Route path="reports" element={<Reports />} />

          <Route path="users" element={<Users />} />

          <Route path="profile" element={<Profile />} />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes