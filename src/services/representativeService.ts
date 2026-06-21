import { httpClient } from '../api/httpClient'
import type {
  Representante,
  RepresentanteFormData,
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
