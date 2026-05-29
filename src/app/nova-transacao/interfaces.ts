export interface NovaSolicitacaoPayload {
  descricao: string;
  valor: number;
  unidadeId: string;
}

export interface ListaUnidadesResponse {
  unidades: Unidade[];
}

export interface Unidade {
  id: string;
  nome: string;
}
