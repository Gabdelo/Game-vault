import { Navigate } from "react-router-dom"
import type { JSX } from "react/jsx-dev-runtime"
import { useAuthStore } from "../store/authStore"


export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const {isAuthenticated, loading} = useAuthStore()
  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center bg-black/90">
      
    </div>
  )

  if (!isAuthenticated && !loading) {
    return <Navigate to="/welcome" />
  }
  return children
}