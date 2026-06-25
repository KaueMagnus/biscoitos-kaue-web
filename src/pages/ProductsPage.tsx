import { useEffect, useState, type FormEvent } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import type { Produto, ProdutoFormData } from '../models/Produto'
import {
  cadastrarProduto,
  editarProduto,
  inativarProduto,
  listarProdutos,
} from '../services/productService'

type ProdutoFormState = {
  codigo: string
  nome: string
  descricao: string
  preco: string
}

const formInicial: ProdutoFormState = {
  codigo: '',
  nome: '',
  descricao: '',
  preco: '',
}

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function montarProduto(form: ProdutoFormState): ProdutoFormData {
  return {
    codigo: form.codigo,
    nome: form.nome,
    descricao: form.descricao,
    preco: Number(form.preco),
  }
}

export function ProductsPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [form, setForm] = useState<ProdutoFormState>(formInicial)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function carregarProdutos() {
    setCarregando(true)
    setErro('')

    try {
      const dados = await listarProdutos()
      setProdutos(dados)
    } catch {
      setErro('Não foi possível carregar os produtos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    async function carregarProdutosIniciais() {
      try {
        const dados = await listarProdutos()
        setProdutos(dados)
      } catch {
        setErro('Não foi possível carregar os produtos.')
      } finally {
        setCarregando(false)
      }
    }

    carregarProdutosIniciais()
  }, [])

  function limparFormulario() {
    setForm(formInicial)
    setProdutoEditando(null)
  }

  function selecionarProduto(produto: Produto) {
    setProdutoEditando(produto)
    setForm({
      codigo: produto.codigo,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: String(produto.preco),
    })
    setMensagem('')
    setErro('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSalvando(true)
    setErro('')
    setMensagem('')

    try {
      const produto = montarProduto(form)

      if (produtoEditando) {
        await editarProduto(produtoEditando.id, produto)
        setMensagem('Produto atualizado com sucesso.')
      } else {
        await cadastrarProduto(produto)
        setMensagem('Produto cadastrado com sucesso.')
      }

      limparFormulario()
      await carregarProdutos()
    } catch {
      setErro('Não foi possível salvar o produto.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleInativar(produto: Produto) {
    const confirmou = window.confirm(
      `Deseja inativar o produto ${produto.nome}?`,
    )

    if (!confirmou) {
      return
    }

    setErro('')
    setMensagem('')

    try {
      await inativarProduto(produto.id)
      setMensagem('Produto inativado com sucesso.')
      await carregarProdutos()
    } catch {
      setErro('Não foi possível inativar o produto.')
    }
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Catálogo</span>
        <h1>Produtos</h1>
        <p>Cadastre, edite e inative produtos vendidos pela equipe comercial.</p>
      </header>

      <section className="page-section">
        <section className="status-form">
          <h2>{produtoEditando ? 'Editar produto' : 'Cadastrar produto'}</h2>

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label htmlFor="codigo">Código</label>
                <input
                  id="codigo"
                  value={form.codigo}
                  onChange={(event) =>
                    setForm({ ...form, codigo: event.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  value={form.nome}
                  onChange={(event) =>
                    setForm({ ...form, nome: event.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="preco">Preço</label>
                <input
                  id="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.preco}
                  onChange={(event) =>
                    setForm({ ...form, preco: event.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                value={form.descricao}
                onChange={(event) =>
                  setForm({ ...form, descricao: event.target.value })
                }
                required
              />
            </div>

            <div className="actions-row">
              <button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar produto'}
              </button>

              {produtoEditando && (
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

        {carregando && <p>Carregando produtos...</p>}

        {!carregando && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td className="table-code">{produto.codigo}</td>
                    <td className="table-strong">{produto.nome}</td>
                    <td>{produto.descricao}</td>
                    <td className="table-strong">{formatarPreco(produto.preco)}</td>
                    <td>
                      {produto.ativo === undefined ? (
                        '-'
                      ) : (
                        <StatusBadge
                          variant={produto.ativo ? 'success' : 'danger'}
                        >
                          {produto.ativo ? 'ATIVO' : 'INATIVO'}
                        </StatusBadge>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => selecionarProduto(produto)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="link-button danger-link"
                          onClick={() => handleInativar(produto)}
                        >
                          Inativar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {produtos.length === 0 && (
              <p className="empty-message">Nenhum produto encontrado.</p>
            )}
          </div>
        )}
      </section>
    </>
  )
}
