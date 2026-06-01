import { Solicitacao } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_DESBRAVA_API_URL;

export const buscarSolicitacoes = async (token: string): Promise<Solicitacao[]> => {
  const res = await fetch(`${API_URL}/api/solicitacoes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Não foi possível carregar as solicitações.");
  return res.json();
};

export const aprovarSolicitacao = async (token: string, id: string, valor?: number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/solicitacoes/${id}/aprovar`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: valor !== undefined ? JSON.stringify({ valor }) : undefined,
  });
  if (!res.ok) throw new Error("Não foi possível aprovar a solicitação.");
};

export const reprovarSolicitacao = async (token: string, id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/solicitacoes/${id}/reprovar`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Não foi possível reprovar a solicitação.");
};
