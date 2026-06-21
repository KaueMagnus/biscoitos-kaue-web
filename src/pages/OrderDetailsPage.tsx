import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  obterNomeCliente,
  obterNomeRepresentante,
  PEDIDO_STATUS,
  type Pedido,
  type PedidoStatus,
} from '../models/Pedido'
import {
  alterarStatusPedido,
  buscarPedidoPorId,
} from '../services/orderService'

function formatarMoeda(valor?: number) {
  if (valor === undefined) {
    return '-'
  }

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function OrderDetailsPage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [statusSelecionado, setStatusSelecionado] =
    useState<PedidoStatus>('PENDENTE')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    async function carregarPedido() {
      if (!id) {
        return
      }

      try {
        const dados = await buscarPedidoPorId(id)
        setPedido(dados)
        setStatusSelecionado(dados.status)
      } catch {
        setErro('Nao foi possivel carregar o pedido.')
      } finally {
        setCarregando(false)
      }
    }

    carregarPedido()
  }, [id])

  async function handleAlterarStatus() {
    if (!id) {
      return
    }

    setErro('')
    setMensagem('')
    setSalvando(true)

    try {
      const pedidoAtualizado = await alterarStatusPedido(id, statusSelecionado)
      setPedido(pedidoAtualizado)
      setStatusSelecionado(pedidoAtualizado.status)
      setMensagem('Status atualizado com sucesso.')
    } catch {
      setErro('Nao foi possivel alterar o status do pedido.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <strong>Detalhe do pedido</strong>
          <span>{id ? `Pedido #${id}` : 'Pedido'}</span>
        </div>

        <Link className="secondary-link" to="/pedidos">
          Voltar
        </Link>
      </header>

      <section className="content">
        {carregando && <p>Carregando pedido...</p>}
        {erro && <p className="error-message">{erro}</p>}

        {pedido && (
          <>
            <div className="details-header">
              <div>
                <h1>Pedido #{pedido.id}</h1>
                <p>{obterNomeCliente(pedido)}</p>
              </div>

              <span className={`status status-${pedido.status.toLowerCase()}`}>
                {pedido.status}
              </span>
            </div>

            <div className="details-grid">
              <div>
                <strong>Cliente</strong>
                <span>{obterNomeCliente(pedido)}</span>
              </div>
              <div>
                <strong>Representante</strong>
                <span>{obterNomeRepresentante(pedido)}</span>
              </div>
              <div>
                <strong>Total</strong>
                <span>{formatarMoeda(pedido.valorTotal ?? pedido.total)}</span>
              </div>
            </div>

            <section className="status-form">
              <h2>Alterar status</h2>
              <div className="form-row">
                <select
                  value={statusSelecionado}
                  onChange={(event) =>
                    setStatusSelecionado(event.target.value as PedidoStatus)
                  }
                >
                  {PEDIDO_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAlterarStatus}
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar status'}
                </button>
              </div>

              {mensagem && <p className="success-message">{mensagem}</p>}
            </section>

            <section>
              <h2>Itens</h2>
              {pedido.itens && pedido.itens.length > 0 ? (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor unitario</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.itens.map((item, index) => (
                        <tr key={item.id ?? index}>
                          <td>{item.nomeProduto ?? 'Produto nao informado'}</td>
                          <td>{item.quantidade ?? '-'}</td>
                          <td>{formatarMoeda(item.precoUnitario)}</td>
                          <td>{formatarMoeda(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty-message">Nenhum item informado.</p>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  )
}
