export type Produto = {
  id: number
  codigo: string
  nome: string
  descricao: string
  preco: number
  ativo?: boolean
}

export type ProdutoFormData = {
  codigo: string
  nome: string
  descricao: string
  preco: number
}
