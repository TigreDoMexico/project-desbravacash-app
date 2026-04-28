"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarUnidade } from "./service";
import { DadosDashboardResponse } from "./interfaces";
import styles from "./dashboard.module.css";
import DashboardBackground from "@/components/layouts/DashboardBackgound/DashboardBackground";
import DashboardCard from "@/components/layouts/DashboardCard/DashboardCard";

export default function DashboardPage() {
  const { token, role, name, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [dadosDashboard, setDadosDashboard] = useState<DadosDashboardResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!token) return;
    buscarUnidade(token)
      .then(setDadosDashboard)
      .catch((e: Error) => setErro(e.message));
  }, [token]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <DashboardBackground>
      {erro && <p className={styles.erro}>{erro}</p>}
      {dadosDashboard && (
        <>
          <DashboardCard className={styles.bemVindoCard}>
            <span className={styles.bemVindoText}>Bem Vindo, {name}</span>
            <p className={styles.unidadeNome}>Unidade {dadosDashboard.unidade.nome}</p>
            <span className={styles.objetivoText}>Cada ação aproxima sua unidade para a vitória</span>
          </DashboardCard>
          <DashboardCard className={styles.balanceCard}>
            <span className={styles.saldoLabel}>Saldo da Unidade</span>
            <span className={styles.saldoValor}>{dadosDashboard.saldo} pts</span>
          </DashboardCard>
          <button
            className={styles.extratoBtn}
            onClick={() => router.push("/extrato")}
          >
            Ver Extrato da Conta
          </button>
          {role === "Admin" && (
            <button
              className={styles.extratoBtn}
              onClick={() => router.push("/nova-transacao")}
            >
              Nova Transação
            </button>
          )}
        </>
      )}
    </DashboardBackground>
  );
}
