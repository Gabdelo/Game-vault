import { Navigate } from "react-router-dom"
import type { JSX } from "react/jsx-dev-runtime"
import { useAuthStore } from "../store/authStore"

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const {isAuthenticated, loading} = useAuthStore()
  if (loading) return <p>Cargando...</p>

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />
  }
  return children
}