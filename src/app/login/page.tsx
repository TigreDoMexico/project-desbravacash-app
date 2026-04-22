"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";
import { RealizarLogin } from "./service";
import LoginBackground from "@/components/layouts/LoginBackground/LoginBackground";
import { User } from "lucide-react";

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
            <div className={styles.field}>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="11XXXXXXXX"
                required
                autoComplete="tel"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
    </LoginBackground>
  );
}
