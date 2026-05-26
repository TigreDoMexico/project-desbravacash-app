import { useState } from "react";
import { Check, X, Calendar, Plus, Minus } from "lucide-react";
import { Solicitacao } from "@/app/aprovacoes/interfaces";
import styles from "./AprovacaoCard.module.css";

interface AprovacaoCardProps {
  solicitacao: Solicitacao;
  onAprovar: (id: string, valor?: number) => Promise<void>;
  onReprovar: (id: string) => Promise<void>;
}

type Confirmacao = "aprovar" | "reprovar" | null;

export default function AprovacaoCard({ solicitacao, onAprovar, onReprovar }: AprovacaoCardProps) {
  const [loading, setLoading] = useState(false);
  const [valorEdit, setValorEdit] = useState<number>(solicitacao.valor);
  const [confirmacao, setConfirmacao] = useState<Confirmacao>(null);

  const handle = async (action: () => Promise<void>) => {
    setLoading(true);
    setConfirmacao(null);
    try { await action(); } finally { setLoading(false); }
  };

  const valorAlterado = valorEdit !== solicitacao.valor;
  const valorValido = !isNaN(valorEdit) && valorEdit > 0;

  const ajustar = (delta: number) =>
    setValorEdit((prev) => Math.max(1, prev + delta));

  return (
    <div className={styles.item}>
      <span className={`${styles.flag} ${solicitacao.tipo === "Desafio" ? styles.flagDesafio : styles.flagManual}`}>
        {solicitacao.tipo}
      </span>

      <span className={styles.descricao}>
        {solicitacao.nomeDesafio ?? solicitacao.descricao}
      </span>

      <div className={styles.dataMeta}>
        <Calendar size={13} />
        <span>{new Date(solicitacao.criadoEm).toLocaleDateString("pt-BR")}</span>
        <span className={styles.nomeUnidade}>{solicitacao.nomeUnidade}</span>
      </div>

      <hr className={styles.divider} />

      <div className={styles.valorRow}>
        <button className={styles.stepBtn} disabled={loading || valorEdit <= 1} onClick={() => ajustar(-1)}>
          <Minus size={14} />
        </button>
        <input
          className={styles.valorInput}
          type="number"
          value={valorEdit}
          onChange={(e) => setValorEdit(Number(e.target.value))}
          disabled={loading}
        />
        <button className={styles.stepBtn} disabled={loading} onClick={() => ajustar(1)}>
          <Plus size={14} />
        </button>
        <span className={styles.pts}>pts</span>
      </div>

      {confirmacao ? (
        <div className={styles.confirmacao}>
          <span className={styles.confirmacaoTexto}>
            {confirmacao === "aprovar" ? "Confirmar aprovação?" : "Confirmar reprovação?"}
          </span>
          <div className={styles.confirmacaoBtns}>
            <button
              className={confirmacao === "aprovar" ? styles.aprovar : styles.reprovar}
              disabled={loading}
              onClick={() =>
                confirmacao === "aprovar"
                  ? handle(() => onAprovar(solicitacao.id, valorAlterado ? valorEdit : undefined))
                  : handle(() => onReprovar(solicitacao.id))
              }
            >
              {loading ? "..." : "Sim"}
            </button>
            <button className={styles.cancelar} disabled={loading} onClick={() => setConfirmacao(null)}>
              Não
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.actions}>
          <button
            className={styles.aprovar}
            disabled={loading || !valorValido}
            onClick={() => setConfirmacao("aprovar")}
          >
            <Check size={14} /> Aprovar
          </button>
          <button className={styles.reprovar} disabled={loading} onClick={() => setConfirmacao("reprovar")}>
            <X size={14} /> Reprovar
          </button>
        </div>
      )}
    </div>
  );
}
