import { SummaryCard } from '../components/SummaryCard'

export function DashboardPage() {
  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Biscoitos Kaue</span>
        <h1>Dashboard</h1>
        <p>Gerencie pedidos, catalogo e equipe comercial em um so painel.</p>
      </header>

      <section className="dashboard-grid">
        <SummaryCard
          title="Pedidos"
          description="Acompanhe pedidos dos representantes e atualize o status."
          to="/pedidos"
          action="Ver pedidos"
        />
        <SummaryCard
          title="Produtos"
          description="Cadastre, edite e inative produtos do catalogo."
          to="/produtos"
          action="Ver produtos"
        />
        <SummaryCard
          title="Representantes"
          description="Gerencie os acessos da equipe comercial."
          to="/representantes"
          action="Ver representantes"
        />
      </section>
    </>
  )
}
