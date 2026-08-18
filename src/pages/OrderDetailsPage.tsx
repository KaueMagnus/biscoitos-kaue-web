import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import {
  obterNomeCliente,
  obterNomeRepresentante,
  PEDIDO_STATUS,
  type ClientePedido,
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

function statusVariant(status: PedidoStatus) {
  if (status === 'PENDENTE') {
    return 'pending'
  }

  if (status === 'ENVIADO') {
    return 'success'
  }

  return 'danger'
}

function valorOuTraco(valor?: string | null) {
  return valor && valor.trim() ? valor : '-'
}

function primeiroTexto(...valores: Array<string | undefined | null>) {
  for (const valor of valores) {
    if (valor && valor.trim()) {
      return valor
    }
  }

  return '-'
}

function CampoDetalhe({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div>
      <strong>{label}</strong>
      <span>{valorOuTraco(value)}</span>
    </div>
  )
}

function DadosClienteNotaFiscal({ cliente }: { cliente?: ClientePedido }) {
  if (!cliente) {
    return (
      <section className="page-section-card">
        <h2>Dados do cliente para nota fiscal</h2>
        <p className="empty-message">
          Dados completos do cliente não foram retornados pelo backend.
        </p>
      </section>
    )
  }

  return (
    <section className="page-section-card">
      <h2>Dados do cliente para nota fiscal</h2>

      <div className="details-grid">
        <CampoDetalhe
          label="Razão Social"
          value={primeiroTexto(cliente.razaoSocial, cliente.nome)}
        />

        <CampoDetalhe
          label="Nome Fantasia"
          value={primeiroTexto(cliente.nomeFantasia, cliente.nome)}
        />

        <CampoDetalhe
          label="CNPJ / CPF"
          value={primeiroTexto(cliente.cnpj, cliente.documento)}
        />

        <CampoDetalhe
          label="IE / Isento"
          value={cliente.inscricaoEstadual}
        />

        <CampoDetalhe
          label="Comprador"
          value={cliente.nomeComprador}
        />

        <CampoDetalhe
          label="Contato"
          value={cliente.telefone}
        />

        <CampoDetalhe
          label="E-mail"
          value={cliente.email}
        />

        <CampoDetalhe
          label="Rua"
          value={cliente.rua}
        />

        <CampoDetalhe
          label="Bairro"
          value={cliente.bairro}
        />

        <CampoDetalhe
          label="Cidade"
          value={cliente.cidade}
        />

        <CampoDetalhe
          label="Estado"
          value={cliente.estado}
        />

        <CampoDetalhe
          label="CEP"
          value={cliente.cep}
        />
      </div>
    </section>
  )
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
        setErro('Não foi possível carregar o pedido.')
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
      setErro('Não foi possível alterar o status do pedido.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      <header className="page-header page-header-row">
        <div>
          <span className="eyebrow">Detalhe do pedido</span>
          <h1>{id ? `Pedido #${id}` : 'Pedido'}</h1>
          <p>Consulte os dados do pedido e atualize o status.</p>
        </div>

        <Link className="secondary-link" to="/pedidos">
          Voltar
        </Link>
      </header>

      <section className="page-section">
        {carregando && <p>Carregando pedido...</p>}
        {erro && <p className="error-message">{erro}</p>}

        {pedido && (
          <>
            <div className="details-header">
              <div>
                <h1>Pedido #{pedido.id}</h1>
                <p>{obterNomeCliente(pedido)}</p>
              </div>

              <StatusBadge variant={statusVariant(pedido.status)}>
                {pedido.status}
              </StatusBadge>
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
                <strong>Tipo</strong>
                <span>{pedido.tipo ?? '-'}</span>
              </div>
              <div>
                <strong>Total</strong>
                <span>{formatarMoeda(pedido.valorTotal ?? pedido.total)}</span>
              </div>
              <div>
                <strong>Observação</strong>
                <span>{valorOuTraco(pedido.observacao)}</span>
              </div>
              <div>
                <strong>Motivo da troca</strong>
                <span>{valorOuTraco(pedido.motivoTroca)}</span>
              </div>
            </div>

            <DadosClienteNotaFiscal cliente={pedido.cliente} />

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

            <section className="page-section-card">
              <h2>Itens</h2>
              {pedido.itens && pedido.itens.length > 0 ? (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor unitário</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.itens.map((item, index) => (
                        <tr key={item.id ?? index}>
                          <td>{item.nomeProduto ?? 'Produto não informado'}</td>
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
    </>
  )
}