"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { buscarUnidades, criarTransacao } from "./service";
import { Unidade } from "./interfaces";
import styles from "./nova-transacao.module.css";

export default function NovaTransacaoPage() {
  const { token, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [unidadeId, setUnidadeId] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("credito");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (role !== "Admin") router.replace("/dashboard");
  }, [isAuthenticated, isLoading, role, router]);

  useEffect(() => {
    if (!token) return;
    buscarUnidades(token)
      .then((data) => {
        setUnidades(data.unidades);
        if (data.unidades.length > 0) setUnidadeId(data.unidades[0].id);
      })
      .catch((e: Error) => setErro(e.message));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setErro(null);
    setSucesso(false);
    setEnviando(true);
    try {
      await criarTransacao(token, { unidadeId, valor, descricao, tipo });
      setSucesso(true);
      setValor("");
      setDescricao("");
      setTipo("credito");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao criar transação.");
    } finally {
      setEnviando(false);
    }
  };

  if (isLoading || !isAuthenticated || role !== "Admin") return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.brand}>DesbravaCash</span>
        <button onClick={() => router.back()} className={styles.backBtn}>
          Voltar
        </button>
      </header>
      <main className={styles.main}>
        <p className={styles.titulo}>Nova Transação</p>
        {erro && <p className={styles.erro}>{erro}</p>}
        {sucesso && <p className={styles.sucesso}>Transação criada com sucesso!</p>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Unidade</label>
            <select
              className={styles.select}
              value={unidadeId}
              onChange={(e) => setUnidadeId(e.target.value)}
              required
            >
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Valor</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Ex: 150"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Descrição</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Ex: Premiação mensal"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tipo</label>
            <select
              className={styles.select}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="credito">Crédito</option>
              <option value="debito">Débito</option>
            </select>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={enviando}>
            {enviando ? "Enviando..." : "Criar Transação"}
          </button>
        </form>
      </main>
    </div>
  );
}
