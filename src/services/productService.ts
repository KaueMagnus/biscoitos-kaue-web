import { httpClient } from '../api/httpClient'
import type { Produto, ProdutoFormData } from '../models/Produto'

export async function listarProdutos() {
  const response = await httpClient.get<Produto[]>('/produtos')
  return response.data
}

export async function cadastrarProduto(produto: ProdutoFormData) {
  const response = await httpClient.post<Produto>('/produtos', produto)
  return response.data
}

export async function editarProduto(id: number, produto: ProdutoFormData) {
  const response = await httpClient.put<Produto>(`/produtos/${id}`, produto)
  return response.data
}

export async function inativarProduto(id: number) {
  await httpClient.patch(`/produtos/${id}/inativar`)
}
