"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarPendentes, atualizarStatus } from "./service";
import { Transacao } from "./interfaces";
import styles from "./aprovacoes.module.css";
import DashboardBackground from "@/components/layouts/DashboardBackgound/DashboardBackground";
import AprovacaoCard from "@/components/layouts/AprovacaoCard/AprovacaoCard";

export default function AprovacoesPage() {
  const { token, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (role !== "Admin") router.replace("/dashboard");
  }, [isAuthenticated, isLoading, role, router]);

  useEffect(() => {
    if (!token) return;
    buscarPendentes(token)
      .then((data) => setTransacoes(data.transacoes))
      .catch((e: Error) => setErro(e.message));
  }, [token]);

  const remover = (id: string) => setTransacoes((prev) => prev.filter((t) => t.id !== id));

  const handleAprovar = async (id: string) => {
    await atualizarStatus(token!, id, 1);
    remover(id);
  };

  const handleReprovar = async (id: string) => {
    await atualizarStatus(token!, id, 2);
    remover(id);
  };

  if (isLoading || !isAuthenticated || role !== "Admin") return null;

  return (
    <DashboardBackground showGreeting={false} title="Aprovações" onBack={() => router.back()}>
      {erro && <p className={styles.erro}>{erro}</p>}
      {!erro && transacoes.length === 0 && (
        <p className={styles.vazio}>Nenhuma transação pendente.</p>
      )}
      <div className={styles.lista}>
        {transacoes.map((t) => (
          <AprovacaoCard
            key={t.id}
            transacao={t}
            onAprovar={handleAprovar}
            onReprovar={handleReprovar}
          />
        ))}
      </div>
    </DashboardBackground>
  );
}
