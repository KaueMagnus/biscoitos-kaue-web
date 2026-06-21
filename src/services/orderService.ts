import { httpClient } from '../api/httpClient'
import type { Pedido, PedidoStatus } from '../models/Pedido'

export async function listarPedidos() {
  const response = await httpClient.get<Pedido[]>('/pedidos')
  return response.data
}

export async function buscarPedidoPorId(id: string) {
  const response = await httpClient.get<Pedido>(`/pedidos/${id}`)
  return response.data
}

export async function alterarStatusPedido(id: string, status: PedidoStatus) {
  const response = await httpClient.patch<Pedido>(`/pedidos/${id}/status`, {
    status,
  })

  return response.data
}
