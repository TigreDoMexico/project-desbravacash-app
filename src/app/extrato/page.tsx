"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarExtrato } from "./service";
import { Transacao } from "./interfaces";
import styles from "./extrato.module.css";
import DashboardBackground from "@/components/layouts/DashboardBackgound/DashboardBackground";
import TransacaoCard from "@/components/layouts/TransacaoCard/TransacaoCard";

export default function ExtratoPage() {
  const { token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!token) return;
    buscarExtrato(token)
      .then((data) => setTransacoes(data.transacoes))
      .catch((e: Error) => setErro(e.message));
  }, [token]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <DashboardBackground showGreeting={false} title="Extrato da Unidade" onBack={() => router.back()}>
      {erro && <p className={styles.erro}>{erro}</p>}
      {!erro && transacoes.length === 0 && (
        <p className={styles.vazio}>Nenhuma transação encontrada.</p>
      )}
      <div className={styles.lista}>
        {transacoes.map((t) => (
          <TransacaoCard key={t.id} transacao={t} />
        ))}
      </div>
    </DashboardBackground>
  );
}
