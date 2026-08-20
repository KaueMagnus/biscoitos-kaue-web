import { useEffect, useState, type FormEvent } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import type { Produto } from '../models/Produto'
import type { Representante } from '../models/Representante'
import type { TabelaVenda, TabelaVendaFormData } from '../models/TabelaVenda'
import { listarProdutos } from '../services/productService'
import { listarRepresentantes } from '../services/representativeService'
import {
  ativarTabelaVenda,
  cadastrarTabelaVenda,
  editarTabelaVenda,
  inativarTabelaVenda,
  listarTabelasVenda,
} from '../services/tabelaVendaService'

type ItemFormRow = {
  produtoId: string
  preco: string
}

const formInicial = {
  nome: '',
}

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function montarTabelaVenda(
  nome: string,
  representanteIds: number[],
  itens: ItemFormRow[],
): TabelaVendaFormData {
  const itensValidos = itens
    .filter((item) => item.produtoId !== '' && item.preco !== '')
    .map((item) => ({
      produtoId: Number(item.produtoId),
      preco: Number(item.preco),
    }))

  return { nome, representanteIds, itens: itensValidos }
}

export function TabelasVendaPage() {
  const [tabelas, setTabelas] = useState<TabelaVenda[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [representantes, setRepresentantes] = useState<Representante[]>([])

  const [form, setForm] = useState(formInicial)
  const [representanteIdsSelecionados, setRepresentanteIdsSelecionados] =
    useState<number[]>([])
  const [itens, setItens] = useState<ItemFormRow[]>([])
  const [tabelaEditando, setTabelaEditando] = useState<TabelaVenda | null>(
    null,
  )
  const [tabelaVisualizando, setTabelaVisualizando] =
    useState<TabelaVenda | null>(null)
  const [tabelaParaInativar, setTabelaParaInativar] =
    useState<TabelaVenda | null>(null)

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [inativando, setInativando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function carregarTabelas() {
    const dados = await listarTabelasVenda()
    setTabelas(dados)
  }

  useEffect(() => {
    async function carregarDadosIniciais() {
      setCarregando(true)
      setErro('')

      try {
        const [tabelasCarregadas, produtosCarregados, representantesCarregados] =
          await Promise.all([
            listarTabelasVenda(),
            listarProdutos(),
            listarRepresentantes(),
          ])

        setTabelas(tabelasCarregadas)
        setProdutos(produtosCarregados)
        setRepresentantes(representantesCarregados)
      } catch {
        setErro('Não foi possível carregar as tabelas de venda.')
      } finally {
        setCarregando(false)
      }
    }

    carregarDadosIniciais()
  }, [])

  function limparFormulario() {
    setForm(formInicial)
    setRepresentanteIdsSelecionados([])
    setItens([])
    setTabelaEditando(null)
  }

  function selecionarTabela(tabela: TabelaVenda) {
    setTabelaEditando(tabela)
    setForm({ nome: tabela.nome })
    setRepresentanteIdsSelecionados(
      tabela.representantes.map((representante) => representante.id),
    )
    setItens(
      tabela.itens.map((item) => ({
        produtoId: String(item.produtoId),
        preco: String(item.preco),
      })),
    )
    setMensagem('')
    setErro('')
  }

  function calcularPrecoView(produto: Produto, tabela: TabelaVenda) {
    const itemPersonalizado = tabela.itens.find(
      (item) => item.produtoId === produto.id,
    )

    return {
      preco: itemPersonalizado ? itemPersonalizado.preco : produto.preco,
      personalizado: Boolean(itemPersonalizado),
    }
  }

  function toggleRepresentante(id: number) {
    setRepresentanteIdsSelecionados((atual) =>
      atual.includes(id)
        ? atual.filter((representanteId) => representanteId !== id)
        : [...atual, id],
    )
  }

  function adicionarItem() {
    setItens((atual) => [...atual, { produtoId: '', preco: '' }])
  }

  function removerItem(index: number) {
    setItens((atual) => atual.filter((_, itemIndex) => itemIndex !== index))
  }

  function atualizarItem(
    index: number,
    campo: keyof ItemFormRow,
    valor: string,
  ) {
    setItens((atual) =>
      atual.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [campo]: valor } : item,
      ),
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setMensagem('')

    if (representanteIdsSelecionados.length === 0) {
      setErro('Selecione ao menos um representante.')
      return
    }

    setSalvando(true)

    try {
      const tabela = montarTabelaVenda(
        form.nome,
        representanteIdsSelecionados,
        itens,
      )

      if (tabelaEditando) {
        await editarTabelaVenda(tabelaEditando.id, tabela)
        setMensagem('Tabela de venda atualizada com sucesso.')
      } else {
        await cadastrarTabelaVenda(tabela)
        setMensagem('Tabela de venda cadastrada com sucesso.')
      }

      limparFormulario()
      await carregarTabelas()
    } catch {
      setErro('Não foi possível salvar a tabela de venda.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleAtivar(tabela: TabelaVenda) {
    setErro('')
    setMensagem('')

    try {
      await ativarTabelaVenda(tabela.id)
      setMensagem('Tabela de venda ativada com sucesso.')
      await carregarTabelas()
    } catch {
      setErro('Não foi possível ativar a tabela de venda.')
    }
  }

  function solicitarInativacao(tabela: TabelaVenda) {
    setTabelaParaInativar(tabela)
    setErro('')
    setMensagem('')
  }

  function cancelarInativacao() {
    if (inativando) {
      return
    }

    setTabelaParaInativar(null)
  }

  async function confirmarInativacao() {
    if (!tabelaParaInativar) {
      return
    }

    setInativando(true)
    setErro('')
    setMensagem('')

    try {
      await inativarTabelaVenda(tabelaParaInativar.id)
      setMensagem('Tabela de venda inativada com sucesso.')
      setTabelaParaInativar(null)
      await carregarTabelas()
    } catch {
      setErro('Não foi possível inativar a tabela de venda.')
    } finally {
      setInativando(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Preços</span>
        <h1>Tabelas de venda</h1>
        <p>
          Cadastre tabelas de preço por representante para uso na criação de
          pedidos.
        </p>
      </header>

      <section className="page-section">
        <section className="status-form">
          <h2>{tabelaEditando ? 'Editar tabela de venda' : 'Cadastrar tabela de venda'}</h2>

          <form className="product-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                value={form.nome}
                onChange={(event) => setForm({ nome: event.target.value })}
                required
              />
            </div>

            <div>
              <label>Representantes</label>
              <div className="checkbox-list">
                {representantes
                  .filter((representante) => representante.ativo !== false)
                  .map((representante) => (
                    <label
                      key={representante.id}
                      className="checkbox-option"
                    >
                      <input
                        type="checkbox"
                        checked={representanteIdsSelecionados.includes(
                          representante.id,
                        )}
                        onChange={() => toggleRepresentante(representante.id)}
                      />
                      {representante.nome}
                    </label>
                  ))}

                {representantes.length === 0 && (
                  <p className="empty-message">
                    Nenhum representante cadastrado.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label>Preços por produto</label>
              <p className="field-hint">
                Informe preço só para os produtos que devem ter valor
                diferente do preço padrão. Os demais seguem o preço padrão do
                produto.
              </p>

              <div className="item-rows">
                {itens.map((item, index) => (
                  <div className="form-row" key={index}>
                    <select
                      value={item.produtoId}
                      onChange={(event) =>
                        atualizarItem(index, 'produtoId', event.target.value)
                      }
                      required
                    >
                      <option value="">Selecione um produto</option>
                      {produtos.map((produto) => (
                        <option key={produto.id} value={produto.id}>
                          {produto.codigo} — {produto.nome}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Preço"
                      value={item.preco}
                      onChange={(event) =>
                        atualizarItem(index, 'preco', event.target.value)
                      }
                      required
                    />

                    <button
                      type="button"
                      className="link-button danger-link"
                      onClick={() => removerItem(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={adicionarItem}
              >
                Adicionar produto
              </button>
            </div>

            <div className="actions-row">
              <button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar tabela de venda'}
              </button>

              {tabelaEditando && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={limparFormulario}
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>

          {mensagem && <p className="success-message">{mensagem}</p>}
          {erro && <p className="error-message">{erro}</p>}
        </section>

        {carregando && <p>Carregando tabelas de venda...</p>}

        {!carregando && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Representantes</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tabelas.map((tabela) => (
                  <tr key={tabela.id}>
                    <td className="table-strong">{tabela.nome}</td>
                    <td>
                      {tabela.representantes
                        .map((representante) => representante.nome)
                        .join(', ') || '-'}
                    </td>
                    <td>
                      {tabela.ativo === undefined ? (
                        '-'
                      ) : (
                        <StatusBadge
                          variant={tabela.ativo ? 'success' : 'danger'}
                        >
                          {tabela.ativo ? 'ATIVA' : 'INATIVA'}
                        </StatusBadge>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => setTabelaVisualizando(tabela)}
                        >
                          Visualizar
                        </button>
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => selecionarTabela(tabela)}
                        >
                          Editar
                        </button>
                        {tabela.ativo === false ? (
                          <button
                            type="button"
                            className="link-button"
                            onClick={() => handleAtivar(tabela)}
                          >
                            Ativar
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="link-button danger-link"
                            onClick={() => solicitarInativacao(tabela)}
                          >
                            Inativar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tabelas.length === 0 && (
              <p className="empty-message">
                Nenhuma tabela de venda encontrada.
              </p>
            )}
          </div>
        )}
      </section>

      {tabelaVisualizando && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <span className="modal-kicker">Tabela de venda</span>
                <h2>{tabelaVisualizando.nome}</h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setTabelaVisualizando(null)}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <p className="modal-description">
              Preço aplicado a cada produto nesta tabela. Somente leitura.
            </p>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Origem</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => {
                    const { preco, personalizado } = calcularPrecoView(
                      produto,
                      tabelaVisualizando,
                    )

                    return (
                      <tr key={produto.id}>
                        <td className="table-strong">{produto.nome}</td>
                        <td>{formatarPreco(preco)}</td>
                        <td>
                          <StatusBadge
                            variant={personalizado ? 'success' : 'neutral'}
                          >
                            {personalizado ? 'PRÓPRIO' : 'PADRÃO'}
                          </StatusBadge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {produtos.length === 0 && (
                <p className="empty-message">Nenhum produto cadastrado.</p>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setTabelaVisualizando(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {tabelaParaInativar && (
        <div className="modal-overlay modal-overlay-confirm" role="presentation">
          <div
            className="modal-card modal-card-confirm"
            role="dialog"
            aria-modal="true"
          >
            <div className="confirm-icon">!</div>

            <h2>Confirmar inativação</h2>

            <p className="modal-description">
              Deseja realmente inativar a tabela{' '}
              <strong>{tabelaParaInativar.nome}</strong>?
            </p>

            <p className="modal-warning">
              Pedidos que já usam essa tabela não são afetados; ela só deixa
              de ficar disponível para novos pedidos.
            </p>

            <div className="modal-actions modal-actions-confirm">
              <button
                type="button"
                className="secondary-button"
                onClick={cancelarInativacao}
                disabled={inativando}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarInativacao}
                disabled={inativando}
              >
                {inativando ? 'Inativando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
