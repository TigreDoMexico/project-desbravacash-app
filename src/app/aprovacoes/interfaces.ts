export interface Solicitacao {
  id: string;
  tipo: string;
  status: string;
  valor: number;
  descricao: string;
  criadoEm: string;
  unidadeId: string;
  nomeUnidade: string;
  nomeDesafio: string | null;
}
