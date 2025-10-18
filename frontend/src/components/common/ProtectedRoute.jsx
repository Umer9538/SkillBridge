import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate home page
    const roleRoutes = {
      learner: '/learner/home',
      company: '/company/home',
      supervisor: '/supervisor/home',
      admin: '/admin/home'
    }
    return <Navigate to={roleRoutes[user.role] || '/login'} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
