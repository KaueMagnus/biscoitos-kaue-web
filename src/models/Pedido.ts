export const PEDIDO_STATUS = ['PENDENTE', 'ENVIADO', 'CANCELADO'] as const

export type PedidoStatus = (typeof PEDIDO_STATUS)[number]

export type PedidoItem = {
  id?: number
  produtoId?: number
  nomeProduto?: string
  quantidade?: number
  precoUnitario?: number
  desconto?: number
  subtotal?: number
}

export type Pedido = {
  id: number
  status: PedidoStatus
  nomeCliente?: string
  nomeUsuario?: string
  tipo?: string
  dataCriacao?: string
  dataPedido?: string
  valorTotal?: number
  total?: number
  itens?: PedidoItem[]
}

export function obterNomeCliente(pedido: Pedido) {
  return pedido.nomeCliente ?? 'Cliente nao informado'
}

export function obterNomeRepresentante(pedido: Pedido) {
  return pedido.nomeUsuario ?? 'Representante nao informado'
}
