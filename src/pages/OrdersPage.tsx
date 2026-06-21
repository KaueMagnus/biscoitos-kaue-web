import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obterNomeCliente, type Pedido } from '../models/Pedido'
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
    <main className="page">
      <header className="topbar">
        <div>
          <strong>Pedidos</strong>
          <span>Listagem geral</span>
        </div>

        <Link className="secondary-link" to="/">
          Dashboard
        </Link>
      </header>

      <section className="content">
        <h1>Pedidos</h1>

        {carregando && <p>Carregando pedidos...</p>}
        {erro && <p className="error-message">{erro}</p>}

        {!carregando && !erro && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>{obterNomeCliente(pedido)}</td>
                    <td>
                      <span className={`status status-${pedido.status.toLowerCase()}`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td>{valorPedido(pedido)}</td>
                    <td>
                      <Link to={`/pedidos/${pedido.id}`}>Abrir detalhe</Link>
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
    </main>
  )
}
