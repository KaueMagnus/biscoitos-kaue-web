import { NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { logout } from '../services/authService'

type AppLayoutProps = {
  children: ReactNode
}

const logoSrc = '/logo_kaue.png'

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-panel">
          <img src={logoSrc} alt="Biscoitos Kaue" />
          <span>Painel administrativo</span>
        </div>

        <nav className="sidebar-nav" aria-label="Navegacao principal">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/pedidos">Pedidos</NavLink>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink to="/representantes">Representantes</NavLink>
        </nav>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <section className="shell-content">{children}</section>
    </main>
  )
}
