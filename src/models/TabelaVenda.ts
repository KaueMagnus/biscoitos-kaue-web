import type { Representante } from './Representante'

export type TabelaVendaItem = {
  produtoId: number
  nomeProduto: string
  preco: number
}

export type TabelaVenda = {
  id: number
  nome: string
  ativo?: boolean
  representantes: Representante[]
  itens: TabelaVendaItem[]
}

export type TabelaVendaItemFormData = {
  produtoId: number
  preco: number
}

export type TabelaVendaFormData = {
  nome: string
  representanteIds: number[]
  itens: TabelaVendaItemFormData[]
}
