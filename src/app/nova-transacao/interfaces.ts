export interface ListaUnidadesResponse {
  unidades: Unidade[];
}

export interface Unidade {
  id: string;
  nome: string;
}

export interface NovaTransacaoPayload {
  unidadeId: string;
  valor: string;
  descricao: string;
  tipoTransacao: string;
}
