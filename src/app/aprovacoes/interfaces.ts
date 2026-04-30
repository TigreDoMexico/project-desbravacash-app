export interface Transacao {
  id: string;
  valor: string;
  descricao: string;
  tipo: string;
  status: string;
  mes: string;
}

export interface TransacoesPendentesResponse {
  transacoes: Transacao[];
}
