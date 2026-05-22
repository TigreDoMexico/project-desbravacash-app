import { Desafio } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_DESBRAVA_API_URL;

export const buscarDesafios = async (token: string): Promise<Desafio[]> => {
  const res = await fetch(`${API_URL}/api/desafios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Não foi possível carregar os desafios.");
  return res.json();
};

export const solicitarDesafio = async (token: string, desafioId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/solicitacoes/desafio/${desafioId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Não foi possível solicitar o desafio.");
};
