import { TransacoesPendentesResponse } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_DESBRAVA_API_URL;

export const buscarPendentes = async (token: string): Promise<TransacoesPendentesResponse> => {
  const res = await fetch(`${API_URL}/api/transacoes/pendentes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Não foi possível carregar as transações pendentes.");

  return res.json();
};

export const atualizarStatus = async (token: string, id: string, status: 1 | 2): Promise<void> => {
  const res = await fetch(`${API_URL}/api/transacoes/${id}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Status: status }),
  });

  if (!res.ok) throw new Error("Não foi possível atualizar o status da transação.");
};
