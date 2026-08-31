export const PEDIDO_STATUS = ['PENDENTE', 'ENVIADO', 'CANCELADO'] as const

export type PedidoStatus = (typeof PEDIDO_STATUS)[number]

export type ClientePedido = {
  id?: number
  nome?: string
  cidade?: string
  telefone?: string
  email?: string
  documento?: string
  razaoSocial?: string
  nomeFantasia?: string
  cnpj?: string
  inscricaoEstadual?: string
  nomeComprador?: string
  rua?: string
  bairro?: string
  estado?: string
  cep?: string
  representanteId?: number
  representanteNome?: string
  ativo?: boolean
}

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
  clienteId?: number
  nomeCliente?: string
  usuarioId?: number
  nomeUsuario?: string
  tipo?: string
  formaPagamento?: string
  dataCriacao?: string
  dataPedido?: string
  observacao?: string
  motivoTroca?: string
  valorTotal?: number
  total?: number
  itens?: PedidoItem[]
  cliente?: ClientePedido
}

export function obterNomeCliente(pedido: Pedido) {
  return (
    pedido.cliente?.nomeFantasia ??
    pedido.cliente?.nome ??
    pedido.nomeCliente ??
    'Cliente não informado'
  )
}

export function obterNomeRepresentante(pedido: Pedido) {
  return pedido.nomeUsuario ?? 'Representante não informado'
}