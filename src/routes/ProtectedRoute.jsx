import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, requiredRole }) {

  const token = localStorage.getItem("token")
  const userRaw = localStorage.getItem("user")
  const user = userRaw ? JSON.parse(userRaw) : null

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute