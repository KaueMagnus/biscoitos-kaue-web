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
  redefinirSenhaRepresentante,
} from '../services/representativeService'

const formInicial: RepresentanteFormData = {
  nome: '',
  email: '',
  senha: '',
}

const senhaFormInicial = {
  novaSenha: '',
  confirmarSenha: '',
}

export function RepresentativesPage() {
  const [representantes, setRepresentantes] = useState<Representante[]>([])
  const [form, setForm] = useState<RepresentanteFormData>(formInicial)
  const [senhaForm, setSenhaForm] = useState(senhaFormInicial)
  const [representanteSelecionado, setRepresentanteSelecionado] =
    useState<Representante | null>(null)

  const [modalSenhaAberto, setModalSenhaAberto] = useState(false)
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvandoSenha, setSalvandoSenha] = useState(false)

  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erroSenha, setErroSenha] = useState('')

  async function carregarRepresentantes() {
    setCarregando(true)
    setErro('')

    try {
      const dados = await listarRepresentantes()
      setRepresentantes(dados)
    } catch {
      setErro('Não foi possível carregar os representantes.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarRepresentantes()
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
      setErro('Não foi possível cadastrar o representante.')
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
      setErro('Não foi possível inativar o representante.')
    }
  }

  function handleAbrirModalSenha(representante: Representante) {
    setRepresentanteSelecionado(representante)
    setSenhaForm(senhaFormInicial)
    setErroSenha('')
    setErro('')
    setMensagem('')
    setMostrarNovaSenha(false)
    setMostrarConfirmarSenha(false)
    setModalSenhaAberto(true)
  }

  function handleFecharModalSenha() {
    if (salvandoSenha) {
      return
    }

    setModalSenhaAberto(false)
    setModalConfirmacaoAberto(false)
    setRepresentanteSelecionado(null)
    setSenhaForm(senhaFormInicial)
    setErroSenha('')
    setMostrarNovaSenha(false)
    setMostrarConfirmarSenha(false)
  }

  function handleSolicitarConfirmacaoSenha(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErroSenha('')

    if (senhaForm.novaSenha.length < 6) {
      setErroSenha('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
      setErroSenha('A confirmação da senha não confere.')
      return
    }

    setModalConfirmacaoAberto(true)
  }

  async function handleConfirmarRedefinicaoSenha() {
    if (!representanteSelecionado) {
      return
    }

    setSalvandoSenha(true)
    setErroSenha('')
    setErro('')
    setMensagem('')

    try {
      await redefinirSenhaRepresentante(representanteSelecionado.id, {
        novaSenha: senhaForm.novaSenha,
      })

      setMensagem(
        `Senha de ${representanteSelecionado.nome} redefinida com sucesso.`,
      )

      handleFecharModalSenha()
    } catch {
      setErroSenha('Não foi possível redefinir a senha do representante.')
      setModalConfirmacaoAberto(false)
    } finally {
      setSalvandoSenha(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <span className="eyebrow">Equipe comercial</span>
        <h1>Representantes</h1>
        <p>Cadastre, inative e redefina senhas de representantes.</p>
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
                <label htmlFor="email">E-mail</label>
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
        </section>

        {mensagem && <p className="success-message">{mensagem}</p>}
        {erro && <p className="error-message">{erro}</p>}

        {carregando && <p>Carregando representantes...</p>}

        {!carregando && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>Ações</th>
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
                      <div className="representative-actions">
                        <button
                          type="button"
                          className="action-button action-button-primary"
                          onClick={() => handleAbrirModalSenha(representante)}
                        >
                          Redefinir senha
                        </button>

                        <button
                          type="button"
                          className="action-button action-button-danger"
                          disabled={representante.ativo === false}
                          onClick={() => handleInativar(representante)}
                        >
                          Inativar
                        </button>
                      </div>
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

      {modalSenhaAberto && representanteSelecionado && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <span className="modal-kicker">Segurança</span>
                <h2>Redefinir senha</h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={handleFecharModalSenha}
                disabled={salvandoSenha}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <p className="modal-description">
              Defina uma nova senha para o representante selecionado. A senha
              atual será substituída.
            </p>

            <div className="modal-selected-card">
              <span>Representante</span>
              <strong>{representanteSelecionado.nome}</strong>
              <small>{representanteSelecionado.email}</small>
            </div>

            <form className="modal-form" onSubmit={handleSolicitarConfirmacaoSenha}>
              <div className="password-modal-grid">
                <div>
                  <label htmlFor="novaSenha">Nova senha</label>
                  <div className="password-input-wrapper">
                    <input
                      id="novaSenha"
                      type={mostrarNovaSenha ? 'text' : 'password'}
                      minLength={6}
                      value={senhaForm.novaSenha}
                      onChange={(event) =>
                        setSenhaForm({
                          ...senhaForm,
                          novaSenha: event.target.value,
                        })
                      }
                      autoFocus
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                    >
                      {mostrarNovaSenha ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmarSenha">Confirmar senha</label>
                  <div className="password-input-wrapper">
                    <input
                      id="confirmarSenha"
                      type={mostrarConfirmarSenha ? 'text' : 'password'}
                      minLength={6}
                      value={senhaForm.confirmarSenha}
                      onChange={(event) =>
                        setSenhaForm({
                          ...senhaForm,
                          confirmarSenha: event.target.value,
                        })
                      }
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() =>
                        setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                      }
                    >
                      {mostrarConfirmarSenha ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>
              </div>

              <ul className="password-rules">
                <li>A senha deve ter no mínimo 6 caracteres.</li>
                <li>Evite senhas muito óbvias, como 123456.</li>
              </ul>

              {erroSenha && <p className="modal-error-message">{erroSenha}</p>}

              <div className="modal-actions">
                <button type="submit" disabled={salvandoSenha}>
                  Salvar nova senha
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleFecharModalSenha}
                  disabled={salvandoSenha}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalConfirmacaoAberto && representanteSelecionado && (
        <div className="modal-overlay modal-overlay-confirm" role="presentation">
          <div
            className="modal-card modal-card-confirm"
            role="dialog"
            aria-modal="true"
          >
            <div className="confirm-icon">!</div>

            <h2>Confirmar redefinição</h2>

            <p className="modal-description">
              Deseja realmente redefinir a senha de{' '}
              <strong>{representanteSelecionado.nome}</strong>?
            </p>

            <p className="modal-warning">
              Após confirmar, a senha anterior não funcionará mais.
            </p>

            <div className="modal-actions modal-actions-confirm">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setModalConfirmacaoAberto(false)}
                disabled={salvandoSenha}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmarRedefinicaoSenha}
                disabled={salvandoSenha}
              >
                {salvandoSenha ? 'Redefinindo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}