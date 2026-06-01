export interface Desafio {
  id: string;
  descricao: string;
  pontuacao: number;
  dataConclusao: string;
  podeSolicitar: boolean;
  solicitado: boolean;
  concluido: boolean;
}
