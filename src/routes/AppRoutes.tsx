import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { OrderDetailsPage } from '../pages/OrderDetailsPage'
import { OrdersPage } from '../pages/OrdersPage'
import { ProductsPage } from '../pages/ProductsPage'
import { RepresentativesPage } from '../pages/RepresentativesPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/pedidos/:id" element={<OrderDetailsPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/representantes" element={<RepresentativesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
