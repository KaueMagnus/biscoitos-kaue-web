import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'

export function DashboardPage() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <strong>Biscoitos Kaue</strong>
          <span>Painel ADMIN</span>
        </div>

        <button type="button" className="secondary-button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <section className="content">
        <h1>Dashboard</h1>
        <p>Acompanhe os pedidos dos representantes comerciais.</p>

        <div className="actions-row">
          <Link className="primary-link" to="/pedidos">
            Ver pedidos
          </Link>
          <Link className="secondary-link" to="/produtos">
            Ver produtos
          </Link>
        </div>
      </section>
    </main>
  )
}
