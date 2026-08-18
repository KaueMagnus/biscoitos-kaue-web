import { httpClient } from '../api/httpClient'
import type {
  Representante,
  RepresentanteFormData,
  RedefinirSenhaRepresentanteData,
} from '../models/Representante'

export async function listarRepresentantes() {
  const response = await httpClient.get<Representante[]>('/representantes')
  return response.data
}

export async function cadastrarRepresentante(
  representante: RepresentanteFormData,
) {
  const response = await httpClient.post<Representante>(
    '/representantes',
    representante,
  )
  return response.data
}

export async function inativarRepresentante(id: number) {
  const response = await httpClient.patch<Representante>(
    `/representantes/${id}/inativar`,
  )
  return response.data
}

export async function redefinirSenhaRepresentante(
  id: number,
  dados: RedefinirSenhaRepresentanteData,
) {
  const response = await httpClient.patch<Representante>(
    `/representantes/${id}/senha`,
    dados,
  )

  return response.data
}