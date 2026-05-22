"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarDesafios, solicitarDesafio } from "./service";
import { Desafio } from "./interfaces";
import styles from "./desafios.module.css";
import DashboardBackground from "@/components/layouts/DashboardBackgound/DashboardBackground";
import DesafioCard from "@/components/layouts/DesafioCard/DesafioCard";

export default function DesafiosPage() {
  const { token, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && isAuthenticated && role !== "Conselheiro") router.replace("/dashboard");
  }, [isAuthenticated, isLoading, role, router]);

  useEffect(() => {
    if (!token || role !== "Conselheiro") return;
    buscarDesafios(token)
      .then(setDesafios)
      .catch((e: Error) => setErro(e.message));
  }, [token, role]);

  const handleSolicitar = async (id: string) => {
    if (!token) return;
    await solicitarDesafio(token, id);
    setDesafios((prev) =>
      prev.map((d) => (d.id === id ? { ...d, podeSolicitar: false, solicitado: true } : d))
    );
  };

  if (isLoading || !isAuthenticated || role !== "Conselheiro") return null;

  return (
    <DashboardBackground showGreeting={false} title="Desafios das Unidades" onBack={() => router.back()}>
      {erro && <p className={styles.erro}>{erro}</p>}
      {!erro && desafios.length === 0 && (
        <p className={styles.vazio}>Nenhum desafio disponível.</p>
      )}
      <div className={styles.lista}>
        {desafios.map((d) => (
          <DesafioCard key={d.id} desafio={d} onSolicitar={handleSolicitar} />
        ))}
      </div>
    </DashboardBackground>
  );
}
