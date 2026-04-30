import { useState } from "react";
import { Check, X } from "lucide-react";
import { Transacao } from "@/app/aprovacoes/interfaces";
import styles from "./AprovacaoCard.module.css";

interface AprovacaoCardProps {
  transacao: Transacao;
  onAprovar: (id: string) => Promise<void>;
  onReprovar: (id: string) => Promise<void>;
}

export default function AprovacaoCard({ transacao, onAprovar, onReprovar }: AprovacaoCardProps) {
  const [loading, setLoading] = useState(false);
  const isDebito = transacao.tipo.toLocaleLowerCase() === "debito";

  const handle = async (action: () => Promise<void>) => {
    setLoading(true);
    try { await action(); } finally { setLoading(false); }
  };

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <span className={styles.descricao}>{transacao.descricao}</span>
        <span className={styles.meta}>{transacao.mes}</span>
        <span className={`${styles.valor} ${isDebito ? styles.debito : styles.credito}`}>
          {isDebito ? "-" : "+"} {transacao.valor}
        </span>
      </div>
      <div className={styles.actions}>
        <button className={styles.aprovar} disabled={loading} onClick={() => handle(() => onAprovar(transacao.id))}>
          <Check size={14} /> Aprovar
        </button>
        <button className={styles.reprovar} disabled={loading} onClick={() => handle(() => onReprovar(transacao.id))}>
          <X size={14} /> Reprovar
        </button>
      </div>
    </div>
  );
}
