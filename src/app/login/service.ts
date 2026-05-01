import { LoginErrorResponse, LoginResponse } from "./interfaces";

const API_URL = process.env.NEXT_PUBLIC_DESBRAVA_API_URL;
const ERRO_DESCONHECIDO = "Ops, algo de errado aconteceu. Entre em contato com o administrador.";

export const RealizarLogin = async (telefone: string, password: string) => {
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telefone: telefone, senha: password }),
        });

        console.log("Resposta da API:", res);

        if (!res.ok) {
            if (res.status === 400) {
                const errorData: LoginErrorResponse = await res.json();
                const message = Object.values(errorData.errors).flat().join(" ");
                throw new Error(message);
            }

            if (res.status === 401) {
                throw new Error("Login inválido. Verifique seu telefone e senha.");
            }

            throw new Error(ERRO_DESCONHECIDO);
        }

        const response: LoginResponse = await res.json();
        return response.token;
    } catch (err: unknown) {
        if(err instanceof TypeError) {
            throw new Error(ERRO_DESCONHECIDO);
        }

        const errorMessage = err instanceof Error ? err.message : ERRO_DESCONHECIDO;
        throw new Error(errorMessage);
    }
}
