import { NovaSolicitacaoPayload, ListaUnidadesResponse } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_DESBRAVA_API_URL;

export const criarSolicitacao = async (token: string, payload: NovaSolicitacaoPayload): Promise<void> => {
  const res = await fetch(`${API_URL}/api/solicitacoes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? "Ocorreu um erro ao criar a solicitação. Tente novamente.");
  }
};

export const buscarUnidades = async (token: string): Promise<ListaUnidadesResponse> => {
  const res = await fetch(`${API_URL}/api/unidades`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Não foi possível carregar as unidades.");

  return res.json();
};