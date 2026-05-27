"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { criarSolicitacao } from "./service";
import styles from "./nova-transacao.module.css";
import DashboardBackground from "@/components/layouts/DashboardBackgound/DashboardBackground";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";

export default function NovaTransacaoPage() {
  const { token, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (!isLoading && !isAuthenticated) {
    router.replace("/login");
    return null;
  }

  if (!isLoading && role !== "Admin") {
    router.replace("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setErro(null);
    setSucesso(false);
    setEnviando(true);
    try {
      await criarSolicitacao(token, { descricao, valor: Number(valor) });
      setSucesso(true);
      setValor("");
      setDescricao("");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Ocorreu um erro ao criar a solicitação. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  if (isLoading || !isAuthenticated || role !== "Admin") return null;

  return (
    <DashboardBackground showGreeting={false} title="Nova Solicitação" onBack={() => router.back()}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Valor"
          id="valor"
          type="number"
          placeholder="Ex: 150"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
        <Input
          label="Descrição"
          id="descricao"
          type="text"
          placeholder="Ex: Premiação mensal"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        {erro && <p className={styles.erro}>{erro}</p>}
        {sucesso && <p className={styles.sucesso}>Solicitação criada com sucesso!</p>}
        <Button type="submit" loading={enviando}>Criar Solicitação</Button>
      </form>
    </DashboardBackground>
  );
}
