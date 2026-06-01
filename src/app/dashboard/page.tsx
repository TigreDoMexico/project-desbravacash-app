"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarUnidade } from "./service";
import { DadosDashboardResponse } from "./interfaces";
import styles from "./dashboard.module.css";
import DashboardBackground from "@/components/layouts/DashboardBackgound/DashboardBackground";
import DashboardCard from "@/components/layouts/DashboardCard/DashboardCard";
import { FileText, Plus, Star, ClipboardCheck, Trophy } from "lucide-react";
import QuickActionButton from "@/components/ui/QuickActionButton/QuickActionButton";

export default function DashboardPage() {
  const { token, role, name, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [dadosDashboard, setDadosDashboard] = useState<DadosDashboardResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const isAdmin = role === "Admin";
  const isTesoureiro = role === "Tesoureiro";
  const isConselheiro = role === "Conselheiro";

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
            <Star size={40} color="#FCBF38" fill="#FCBF38" />
            <div className={styles.balanceInfo}>
              <span className={styles.saldoLabel}>Saldo da Unidade</span>
              <span className={styles.saldoValor}>{dadosDashboard.saldo} pts</span>
            </div>
          </DashboardCard>
          <DashboardCard className={styles.quickActionsCard}>
            <span>Ações Rápidas</span>
            <div className={styles.quickActionsRow}>
              <QuickActionButton
                icon={<FileText size={22} />}
                label="Ver Extrato"
                onClick={() => router.push("/extrato")}
              />
              {(isAdmin || isTesoureiro) && (
                <QuickActionButton
                  icon={<Plus size={22} />}
                  label="Nova Transação"
                  onClick={() => router.push("/nova-transacao")}
                />
              )}
              {isAdmin && (
                <QuickActionButton
                  icon={<ClipboardCheck size={22} />}
                  label="Aprovar Transações"
                  onClick={() => router.push("/aprovacoes")}
                />
              )}
              {isConselheiro && (
                <QuickActionButton
                  icon={<Trophy size={22} />}
                  label="Desafios"
                  onClick={() => router.push("/desafios")}
                />
              )}
            </div>
          </DashboardCard>
        </>
      )}
    </DashboardBackground>
  );
}
