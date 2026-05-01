export interface Transacao {
  id: string;
  valor: string;
  descricao: string;
  nomeUnidade: string;
  tipo: string;
  status: string;
  mes: string;
}

export interface TransacoesPendentesResponse {
  transacoes: Transacao[];
}
