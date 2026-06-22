import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import {
  obterNomeCliente,
  obterNomeRepresentante,
  type Pedido,
  type PedidoStatus,
} from '../models/Pedido'
import { listarPedidos } from '../services/orderService'

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
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const dados = await listarPedidos()
        setPedidos(dados)
      } catch {
        setErro('Nao foi possivel carregar os pedidos.')
      } finally {
        setCarregando(false)
      }
    }

    carregarPedidos()
  }, [])

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
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="table-id">#{pedido.id}</td>
                    <td className="table-strong">{obterNomeCliente(pedido)}</td>
                    <td>{obterNomeRepresentante(pedido)}</td>
                    <td>{pedido.tipo ?? '-'}</td>
                    <td>
                      <StatusBadge variant={statusVariant(pedido.status)}>
                        {pedido.status}
                      </StatusBadge>
                    </td>
                    <td className="table-strong">{valorPedido(pedido)}</td>
                    <td>
                      <Link className="table-link" to={`/pedidos/${pedido.id}`}>
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
          </div>
        )}
      </section>
    </>
  )
}
