"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.brand}>DesbravaCash</span>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sair
        </button>
      </header>
      <main className={styles.main}>
        <h1>Dashboard</h1>
        <p>Você está autenticado com sucesso.</p>
      </main>
    </div>
  );
}
