import { ListaUnidadesResponse, NovaTransacaoPayload } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_DESBRAVA_API_URL;

export const buscarUnidades = async (token: string): Promise<ListaUnidadesResponse> => {
  const res = await fetch(`${API_URL}/api/unidades`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Não foi possível carregar as unidades.");

  return res.json();
};

export const criarTransacao = async (token: string, payload: NovaTransacaoPayload): Promise<void> => {
  const res = await fetch(`${API_URL}/api/transacoes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Não foi possível criar a transação.");
};
