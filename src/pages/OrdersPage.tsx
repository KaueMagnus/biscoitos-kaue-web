import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import {
  obterNomeCliente,
  obterNomeRepresentante,
  type Pedido,
  type PedidoStatus,
} from '../models/Pedido'
import { listarPedidos } from '../services/orderService'

type StatusFiltro = 'TODOS' | PedidoStatus
type TipoFiltro = 'TODOS' | 'NORMAL' | 'TROCA'

function valorPedido(pedido: Pedido) {
  const valor = pedido.valorTotal ?? pedido.total

  if (valor === undefined) {
    return '-'
  }

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function statusVariant(status: PedidoStatus) {
  if (status === 'PENDENTE') {
    return 'pending'
  }

  if (status === 'ENVIADO') {
    return 'success'
  }

  return 'danger'
}

export function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('TODOS')
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('TODOS')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const dados = await listarPedidos()
        setPedidos(dados)
      } catch {
        setErro('Não foi possível carregar os pedidos.')
      } finally {
        setCarregando(false)
      }
    }

    carregarPedidos()
  }, [])

  const pedidosFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase()

    return [...pedidos]
      .sort((pedidoA, pedidoB) => pedidoB.id - pedidoA.id)
      .filter((pedido) => {
        const nomeCliente = obterNomeCliente(pedido).toLowerCase()
        const nomeRepresentante = obterNomeRepresentante(pedido).toLowerCase()
        const tipoPedido = pedido.tipo?.toUpperCase()

        const atendeBusca =
          !termoBusca ||
          nomeCliente.includes(termoBusca) ||
          nomeRepresentante.includes(termoBusca)
        const atendeStatus =
          statusFiltro === 'TODOS' || pedido.status === statusFiltro
        const atendeTipo = tipoFiltro === 'TODOS' || tipoPedido === tipoFiltro

        return atendeBusca && atendeStatus && atendeTipo
      })
  }, [busca, pedidos, statusFiltro, tipoFiltro])

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Pedidos</span>
        <h1>Listagem geral</h1>
        <p>Acompanhe pedidos enviados pelos representantes comerciais.</p>
      </header>

      <section className="page-section">
        {carregando && <p>Carregando pedidos...</p>}
        {erro && <p className="error-message">{erro}</p>}

        {!carregando && !erro && (
          <>
            <section className="filters-card">
              <div>
                <label htmlFor="busca-pedidos">Buscar</label>
                <input
                  id="busca-pedidos"
                  type="search"
                  placeholder="Cliente ou representante"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="status-pedidos">Status</label>
                <select
                  id="status-pedidos"
                  value={statusFiltro}
                  onChange={(event) =>
                    setStatusFiltro(event.target.value as StatusFiltro)
                  }
                >
                  <option value="TODOS">TODOS</option>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="ENVIADO">ENVIADO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </div>

              <div>
                <label htmlFor="tipo-pedidos">Tipo</label>
                <select
                  id="tipo-pedidos"
                  value={tipoFiltro}
                  onChange={(event) =>
                    setTipoFiltro(event.target.value as TipoFiltro)
                  }
                >
                  <option value="TODOS">TODOS</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="TROCA">TROCA</option>
                </select>
              </div>

              <div className="filters-summary">
                <strong>{pedidosFiltrados.length}</strong>
                <span>
                  {pedidosFiltrados.length === 1
                    ? 'pedido encontrado'
                    : 'pedidos encontrados'}
                </span>
              </div>
            </section>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Representante</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Total</th>
                  <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id}>
                      <td className="table-id">#{pedido.id}</td>
                      <td className="table-strong">
                        {obterNomeCliente(pedido)}
                      </td>
                      <td>{obterNomeRepresentante(pedido)}</td>
                      <td>{pedido.tipo ?? '-'}</td>
                      <td>
                        <StatusBadge variant={statusVariant(pedido.status)}>
                          {pedido.status}
                        </StatusBadge>
                      </td>
                      <td className="table-strong">{valorPedido(pedido)}</td>
                      <td>
                        <Link
                          className="table-link"
                          to={`/pedidos/${pedido.id}`}
                        >
                          Abrir detalhe
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pedidos.length === 0 && (
                <p className="empty-message">Nenhum pedido encontrado.</p>
              )}

              {pedidos.length > 0 && pedidosFiltrados.length === 0 && (
                <p className="empty-message">
                  Nenhum pedido encontrado com os filtros selecionados.
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </>
  )
}
