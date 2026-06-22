import { Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { isAuthenticated } from '../services/authService'

export function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
