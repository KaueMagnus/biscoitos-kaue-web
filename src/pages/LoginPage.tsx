import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const [loginUsuario, setLoginUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await login({ login: loginUsuario, senha })
      navigate('/')
    } catch {
      setErro('Não foi possível fazer login. Verifique seus dados.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="login-brand-content">
          <div className="login-logo-box">
            <img src="/logo_biscoitos_kaue.png" alt="Biscoitos Kauê" />
          </div>
          <span>Painel administrativo</span>
          <h1>Gestão comercial com sabor de casa.</h1>
          <p>
            Pedidos, produtos e representantes em um painel simples para ADMIN.
          </p>
        </div>
      </section>

      <section className="login-box">
        <span className="eyebrow">Acesso ADMIN</span>
        <h2>Entrar no painel</h2>
        <p>Informe suas credenciais para continuar.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login">E-mail ou usuário</label>
            <input
              id="login"
              type="text"
              value={loginUsuario}
              onChange={(event) => setLoginUsuario(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>

          {erro && <span className="error-message">{erro}</span>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}
