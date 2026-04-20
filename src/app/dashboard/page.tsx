"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarUnidade } from "./service";
import { DadosDashboardResponse } from "./interfaces";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const { token, role, isAuthenticated, isLoading, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.brand}>DesbravaCash</span>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sair
        </button>
      </header>
      <main className={styles.main}>
        {erro && <p className={styles.erro}>{erro}</p>}
        {dadosDashboard && (
          <>
            <p className={styles.unidadeNome}>{dadosDashboard.unidade.nome}</p>
            <div className={styles.saldoCard}>
              <span className={styles.saldoLabel}>Saldo de Pontos</span>
              <span className={styles.saldoValor}>
                {dadosDashboard.saldo} pts
              </span>
            </div>
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
      </main>
    </div>
  );
}
