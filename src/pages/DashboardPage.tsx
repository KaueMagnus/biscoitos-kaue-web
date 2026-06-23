import { useEffect, useState } from 'react'
import { SummaryCard } from '../components/SummaryCard'
import { listarPedidos } from '../services/orderService'
import { listarProdutos } from '../services/productService'
import { listarRepresentantes } from '../services/representativeService'

type DashboardResumo = {
  totalPedidos: number
  pedidosPendentes: number
  pedidosEnviados: number
  pedidosCancelados: number
  produtosAtivos: number
  representantesAtivos: number
}

const resumoInicial: DashboardResumo = {
  totalPedidos: 0,
  pedidosPendentes: 0,
  pedidosEnviados: 0,
  pedidosCancelados: 0,
  produtosAtivos: 0,
  representantesAtivos: 0,
}

export function DashboardPage() {
  const [resumo, setResumo] = useState<DashboardResumo>(resumoInicial)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarResumo() {
      const [pedidosResult, produtosResult, representantesResult] =
        await Promise.allSettled([
          listarPedidos(),
          listarProdutos(),
          listarRepresentantes(),
        ])

      const pedidos =
        pedidosResult.status === 'fulfilled' ? pedidosResult.value : []
      const produtos =
        produtosResult.status === 'fulfilled' ? produtosResult.value : []
      const representantes =
        representantesResult.status === 'fulfilled'
          ? representantesResult.value
          : []

      setResumo({
        totalPedidos: pedidos.length,
        pedidosPendentes: pedidos.filter(
          (pedido) => pedido.status === 'PENDENTE',
        ).length,
        pedidosEnviados: pedidos.filter((pedido) => pedido.status === 'ENVIADO')
          .length,
        pedidosCancelados: pedidos.filter(
          (pedido) => pedido.status === 'CANCELADO',
        ).length,
        produtosAtivos: produtos.filter((produto) => produto.ativo !== false)
          .length,
        representantesAtivos: representantes.filter(
          (representante) => representante.ativo !== false,
        ).length,
      })

      if (
        pedidosResult.status === 'rejected' ||
        produtosResult.status === 'rejected' ||
        representantesResult.status === 'rejected'
      ) {
        setErro('Alguns dados do resumo nao puderam ser carregados.')
      }

      setCarregando(false)
    }

    carregarResumo()
  }, [])

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Biscoitos Kaue</span>
        <h1>Dashboard</h1>
        <p>Gerencie pedidos, catalogo e equipe comercial em um so painel.</p>
      </header>

      <section className="metrics-grid">
        <article className="metric-card">
          <span>Total de pedidos</span>
          <strong>{carregando ? '-' : resumo.totalPedidos}</strong>
        </article>
        <article className="metric-card metric-card-pending">
          <span>Pedidos pendentes</span>
          <strong>{carregando ? '-' : resumo.pedidosPendentes}</strong>
        </article>
        <article className="metric-card metric-card-success">
          <span>Pedidos enviados</span>
          <strong>{carregando ? '-' : resumo.pedidosEnviados}</strong>
        </article>
        <article className="metric-card metric-card-danger">
          <span>Pedidos cancelados</span>
          <strong>{carregando ? '-' : resumo.pedidosCancelados}</strong>
        </article>
        <article className="metric-card">
          <span>Produtos ativos</span>
          <strong>{carregando ? '-' : resumo.produtosAtivos}</strong>
        </article>
        <article className="metric-card">
          <span>Representantes ativos</span>
          <strong>{carregando ? '-' : resumo.representantesAtivos}</strong>
        </article>
      </section>

      {erro && <p className="error-message">{erro}</p>}

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
