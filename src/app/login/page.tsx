"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";
import { RealizarLogin } from "./service";
import LoginBackground from "@/components/layouts/LoginBackground/LoginBackground";
import { Phone, User, Lock, Trophy, BarChart2 } from "lucide-react";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import LoginFooterCard from "@/components/layouts/LoginFooterCard/LoginFooterCard";

export default function LoginPage() {
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await RealizarLogin(telefone, password);
      login(token);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginBackground>
      <Image src="/clube_logo.png" alt="DesbravaCash" width={120} height={150} />
      <span className={styles.placeholder}>DESBRAVA<span className={styles.highlight}>CASH</span></span>
      <span className={styles.subplaceholder}>Seu banco de pontos de unidades</span>

      <div className={styles.card}>
        <div className={styles.titleBox}>
          <div className={styles.titleIconBox}>
            <User size={30} color="#4F46E5" />
          </div>
          <h1 className={styles.title}>Entrar na sua conta</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Telefone"
            id="telefone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Seu telefone (11.....)"
            required
            autoComplete="tel"
            icon={<Phone size={16} />}
          />

          <Input
            label="Senha"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha
              "
            required
            autoComplete="current-password"
            icon={<Lock size={16} />}
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" loading={loading}>Entrar</Button>
        </form>
      </div>

      <div className={styles.footer}>
        <LoginFooterCard
          icon={<Trophy size={20} />}
          title="Conquistas"
          description="Acompanhe seus pontos"
          color="#FCBF38"
        />
        <LoginFooterCard
          icon={<BarChart2 size={20} />}
          title="Ranking"
          description="Veja sua posição"
          color="#3A9465"
        />
      </div>
      <span className={styles.copyright}>&copy; 2026 DesbravaCash. Todos os Direitos Reservados</span>
    </LoginBackground>
  );
}
