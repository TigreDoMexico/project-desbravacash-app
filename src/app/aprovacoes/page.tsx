"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarSolicitacoes, aprovarSolicitacao, reprovarSolicitacao } from "./service";
import { Solicitacao } from "./interfaces";
import styles from "./aprovacoes.module.css";
import DashboardBackground from "@/components/layouts/DashboardBackgound/DashboardBackground";
import AprovacaoCard from "@/components/layouts/AprovacaoCard/AprovacaoCard";

export default function AprovacoesPage() {
  const { token, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (role !== "Admin") { router.replace("/dashboard"); return; }
    if (!token) return;

    buscarSolicitacoes(token)
      .then((data) => setSolicitacoes(data.filter((s) => s.status === "Solicitado")))
      .catch((e: Error) => setErro(e.message));
  }, [isAuthenticated, isLoading, role, token, router]);

  const remover = (id: string) => setSolicitacoes((prev) => prev.filter((s) => s.id !== id));

  const handleAprovar = async (id: string, valor?: number) => {
    await aprovarSolicitacao(token!, id, valor);
    remover(id);
  };

  const handleReprovar = async (id: string) => {
    await reprovarSolicitacao(token!, id);
    remover(id);
  };

  if (isLoading || !isAuthenticated || role !== "Admin") return null;

  return (
    <DashboardBackground showGreeting={false} title="Aprovações" onBack={() => router.back()}>
      {erro && <p className={styles.erro}>{erro}</p>}
      {!erro && solicitacoes.length === 0 && (
        <p className={styles.vazio}>Nenhuma solicitação pendente.</p>
      )}
      <div className={styles.lista}>
        {solicitacoes.map((s) => (
          <AprovacaoCard
            key={s.id}
            solicitacao={s}
            onAprovar={handleAprovar}
            onReprovar={handleReprovar}
          />
        ))}
      </div>
    </DashboardBackground>
  );
}
