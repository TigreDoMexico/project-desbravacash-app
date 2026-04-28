import styles from "./TitleLabel.module.css";

interface TitleLabelProps {
  fontSize?: string;
}

export default function TitleLabel({ fontSize = "2rem" }: TitleLabelProps) {
  return (
    <span className={styles.label} style={{ fontSize }}>
      DESBRAVA<span className={styles.highlight}>CASH</span>
    </span>
  );
}
