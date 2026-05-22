import { useState } from "react";
import { CheckCircle, Clock, Send } from "lucide-react";
import { Desafio } from "@/app/desafios/interfaces";
import styles from "./DesafioCard.module.css";

interface DesafioCardProps {
  desafio: Desafio;
  onSolicitar: (id: string) => Promise<void>;
}

export default function DesafioCard({ desafio, onSolicitar }: DesafioCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSolicitar = async () => {
    setLoading(true);
    try { await onSolicitar(desafio.id); } finally { setLoading(false); }
  };

  return (
    <div className={styles.item}>
      <div className={styles.status}>
        {desafio.concluido
          ? <CheckCircle size={22} className={styles.iconConcluido} />
          : <Clock size={22} className={styles.iconPendente} />}
      </div>
      <div className={styles.info}>
        <span className={styles.descricao}>{desafio.descricao}</span>
        <span className={styles.meta}>
          {desafio.pontuacao} pts · Prazo: {new Date(desafio.dataConclusao).toLocaleDateString("pt-BR")}
        </span>
        {desafio.solicitado && !desafio.concluido && (
          <span className={styles.badge}>Aguardando aprovação</span>
        )}
      </div>
      {!desafio.concluido && desafio.podeSolicitar && !desafio.solicitado && (
        <button className={styles.solicitarBtn} disabled={loading} onClick={handleSolicitar}>
          <Send size={14} />
          {loading ? "Enviando..." : "Solicitar"}
        </button>
      )}
    </div>
  );
}
