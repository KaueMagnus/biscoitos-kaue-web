export type Representante = {
  id: number
  nome: string
  email: string
  ativo?: boolean
}

export type RepresentanteFormData = {
  nome: string
  email: string
  senha: string
}
