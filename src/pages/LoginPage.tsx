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
      setErro('Nao foi possivel fazer login. Verifique seus dados.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-box">
        <h1>Biscoitos Kaue</h1>
        <p>Painel administrativo</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login">E-mail ou usuario</label>
          <input
            id="login"
            type="text"
            value={loginUsuario}
            onChange={(event) => setLoginUsuario(event.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />

          {erro && <span className="error-message">{erro}</span>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}
