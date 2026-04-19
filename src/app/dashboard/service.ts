import { UnidadeResponse } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_DESBRAVA_API_URL;

export const buscarUnidade = async (token: string): Promise<UnidadeResponse> => {
  const res = await fetch(`${API_URL}/api/unidade/minha`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Não foi possível carregar os dados da unidade.");

  return res.json();
};
