import { useEffect, useState, type FormEvent } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import type {
  Representante,
  RepresentanteFormData,
} from '../models/Representante'
import {
  cadastrarRepresentante,
  inativarRepresentante,
  listarRepresentantes,
} from '../services/representativeService'

const formInicial: RepresentanteFormData = {
  nome: '',
  email: '',
  senha: '',
}

export function RepresentativesPage() {
  const [representantes, setRepresentantes] = useState<Representante[]>([])
  const [form, setForm] = useState<RepresentanteFormData>(formInicial)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function carregarRepresentantes() {
    setCarregando(true)
    setErro('')

    try {
      const dados = await listarRepresentantes()
      setRepresentantes(dados)
    } catch {
      setErro('Nao foi possivel carregar os representantes.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    async function carregarRepresentantesIniciais() {
      try {
        const dados = await listarRepresentantes()
        setRepresentantes(dados)
      } catch {
        setErro('Nao foi possivel carregar os representantes.')
      } finally {
        setCarregando(false)
      }
    }

    carregarRepresentantesIniciais()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSalvando(true)
    setErro('')
    setMensagem('')

    try {
      await cadastrarRepresentante(form)
      setMensagem('Representante cadastrado com sucesso.')
      setForm(formInicial)
      await carregarRepresentantes()
    } catch {
      setErro('Nao foi possivel cadastrar o representante.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleInativar(representante: Representante) {
    const confirmou = window.confirm(
      `Deseja inativar o representante ${representante.nome}?`,
    )

    if (!confirmou) {
      return
    }

    setErro('')
    setMensagem('')

    try {
      await inativarRepresentante(representante.id)
      setMensagem('Representante inativado com sucesso.')
      await carregarRepresentantes()
    } catch {
      setErro('Nao foi possivel inativar o representante.')
    }
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Equipe comercial</span>
        <h1>Representantes</h1>
        <p>Cadastre e inative representantes que acessam o app mobile.</p>
      </header>

      <section className="page-section">
        <section className="status-form">
          <h2>Cadastrar representante</h2>

          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-grid">
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
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  minLength={6}
                  value={form.senha}
                  onChange={(event) =>
                    setForm({ ...form, senha: event.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="actions-row">
              <button type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar representante'}
              </button>
            </div>
          </form>

          {mensagem && <p className="success-message">{mensagem}</p>}
          {erro && <p className="error-message">{erro}</p>}
        </section>

        {carregando && <p>Carregando representantes...</p>}

        {!carregando && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {representantes.map((representante) => (
                  <tr key={representante.id}>
                    <td className="table-id">#{representante.id}</td>
                    <td className="table-strong">{representante.nome}</td>
                    <td>{representante.email}</td>
                    <td>
                      {representante.ativo === undefined ? (
                        '-'
                      ) : (
                        <StatusBadge
                          variant={representante.ativo ? 'success' : 'danger'}
                        >
                          {representante.ativo ? 'ATIVO' : 'INATIVO'}
                        </StatusBadge>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="link-button danger-link"
                        disabled={representante.ativo === false}
                        onClick={() => handleInativar(representante)}
                      >
                        Inativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {representantes.length === 0 && (
              <p className="empty-message">Nenhum representante encontrado.</p>
            )}
          </div>
        )}
      </section>
    </>
  )
}
