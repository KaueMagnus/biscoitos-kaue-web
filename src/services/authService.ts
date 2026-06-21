import type { AxiosResponse } from 'axios'
import { httpClient } from '../api/httpClient'

type LoginRequest = {
  login: string
  senha: string
}

type LoginResponse =
  | string
  | {
      token?: string
      accessToken?: string
      access_token?: string
      jwt?: string
      bearerToken?: string
      data?: {
        token?: string
        accessToken?: string
        access_token?: string
        jwt?: string
        bearerToken?: string
      }
}

type LoginPayload =
  | {
      email: string
      senha: string
    }
  | {
      email: string
      password: string
    }
  | {
      username: string
      password: string
    }
  | {
      login: string
      senha: string
    }
  | {
      login: string
      password: string
    }

function limparBearer(token: string) {
  return token.replace(/^Bearer\s+/i, '')
}

function extrairTokenDaResposta(response: AxiosResponse<LoginResponse>) {
  const headerToken = response.headers.authorization

  if (headerToken) {
    return limparBearer(headerToken)
  }

  const data = response.data

  if (typeof data === 'string') {
    return limparBearer(data)
  }

  const token =
    data.token ??
    data.accessToken ??
    data.access_token ??
    data.jwt ??
    data.bearerToken ??
    data.data?.token ??
    data.data?.accessToken ??
    data.data?.access_token ??
    data.data?.jwt ??
    data.data?.bearerToken

  return token ? limparBearer(token) : undefined
}

export async function login(dados: LoginRequest) {
  const tentativas: LoginPayload[] = [
    { email: dados.login, senha: dados.senha },
    { email: dados.login, password: dados.senha },
    { username: dados.login, password: dados.senha },
    { login: dados.login, senha: dados.senha },
    { login: dados.login, password: dados.senha },
  ]

  let ultimoErro: unknown

  for (const payload of tentativas) {
    try {
      const response = await httpClient.post<LoginResponse>('/auth/login', payload)
      const token = extrairTokenDaResposta(response)

      if (!token) {
        throw new Error('Login realizado, mas o servidor nao retornou o token.')
      }

      localStorage.setItem('token', token)
      return
    } catch (error) {
      ultimoErro = error
    }
  }

  throw ultimoErro
}

export function logout() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'))
}
