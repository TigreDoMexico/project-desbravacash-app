"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import styles from "./DashboardBackground.module.css";
import TitleLabel from "@/components/ui/TitleLabel/TitleLabel";

export default function DashboardBackground({ children }: { children: React.ReactNode }) {
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
          <span className={styles.greeting}>Olá, {name ?? "usuário"}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
