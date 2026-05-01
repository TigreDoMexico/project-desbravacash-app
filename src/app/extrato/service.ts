import { ExtratoResponse } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_DESBRAVA_API_URL;

export const buscarExtrato = async (token: string): Promise<ExtratoResponse> => {
  const res = await fetch(`${API_URL}/api/transacoes`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Não foi possível carregar o extrato.");

  return res.json();
};
