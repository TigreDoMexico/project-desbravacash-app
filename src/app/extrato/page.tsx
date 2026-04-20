"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarExtrato } from "./service";
import { Transacao } from "./interfaces";
import styles from "./extrato.module.css";

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
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.brand}>DesbravaCash</span>
        <button onClick={() => router.back()} className={styles.backBtn}>
          Voltar
        </button>
      </header>
      <main className={styles.main}>
        <p className={styles.titulo}>Extrato da Unidade</p>
        {erro && <p className={styles.erro}>{erro}</p>}
        {!erro && transacoes.length === 0 && (
          <p className={styles.vazio}>Nenhuma transação encontrada.</p>
        )}
        <div className={styles.lista}>
          {transacoes.map((t) => (
            <div key={t.id} className={styles.item}>
              <div className={styles.info}>
                <span className={styles.descricao}>{t.descricao}</span>
                <span className={styles.meta}>{t.mes}</span>
              </div>
              <div className={styles.direita}>
                <span className={`${styles.valor} ${styles[t.tipo]}`}>
                  {t.tipo === "debito" ? "-" : "+"} {t.valor}
                </span>
                <span className={styles.status}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
