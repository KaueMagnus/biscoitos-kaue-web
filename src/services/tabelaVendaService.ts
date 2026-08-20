import { httpClient } from '../api/httpClient'
import type { TabelaVenda, TabelaVendaFormData } from '../models/TabelaVenda'

export async function listarTabelasVenda() {
  const response = await httpClient.get<TabelaVenda[]>('/tabelas-venda')
  return response.data
}

export async function cadastrarTabelaVenda(tabela: TabelaVendaFormData) {
  const response = await httpClient.post<TabelaVenda>('/tabelas-venda', tabela)
  return response.data
}

export async function editarTabelaVenda(
  id: number,
  tabela: TabelaVendaFormData,
) {
  const response = await httpClient.put<TabelaVenda>(
    `/tabelas-venda/${id}`,
    tabela,
  )
  return response.data
}

export async function ativarTabelaVenda(id: number) {
  const response = await httpClient.patch<TabelaVenda>(
    `/tabelas-venda/${id}/ativar`,
  )
  return response.data
}

export async function inativarTabelaVenda(id: number) {
  const response = await httpClient.patch<TabelaVenda>(
    `/tabelas-venda/${id}/inativar`,
  )
  return response.data
}
