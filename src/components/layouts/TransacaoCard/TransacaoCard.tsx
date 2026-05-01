import { Transacao } from "@/app/extrato/interfaces";
import styles from "./TransacaoCard.module.css";

export default function TransacaoCard({ transacao }: { transacao: Transacao }) {
  const isDebito = transacao.tipo.toLocaleLowerCase() === "debito";

  return (
    <div className={styles.item}>
      <div className={styles.data}>
        <span>{transacao.mes}</span>
      </div>
      <div className={styles.info}>
        <span className={styles.descricao}>{transacao.descricao}</span>
      </div>
      <div className={styles.direita}>
        <span className={`${styles.valor} ${isDebito ? styles.debito : styles.credito}`}>
          {isDebito ? "-" : "+"} {transacao.valor}
        </span>
        <span className={styles.status}>{transacao.status}</span>
      </div>
    </div>
  );
}
