"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ChevronLeft } from "lucide-react";
import styles from "./DashboardBackground.module.css";
import TitleLabel from "@/components/ui/TitleLabel/TitleLabel";

interface DashboardBackgroundProps {
  children: React.ReactNode;
  showGreeting?: boolean;
  title?: string;
  onBack?: () => void;
}

export default function DashboardBackground({ children, showGreeting = true, title, onBack }: DashboardBackgroundProps) {
  const { name, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Image src="/clube_logo.png" alt="DesbravaCash" width={32} height={35} />
          <TitleLabel fontSize="0.9rem"/>
        </div>
        <div className={styles.actions}>
          {showGreeting && <span className={styles.greeting}>Olá, {name ?? "usuário"}</span>}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>
      <main className={styles.content}>
        {(onBack || title) && (
          <div className={styles.pageHeader}>
            {onBack && (
              <button className={styles.backBtn} onClick={onBack}>
                <ChevronLeft size={18} />
                Voltar
              </button>
            )}
            {title && <h1 className={styles.pageTitle}>{title}</h1>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
