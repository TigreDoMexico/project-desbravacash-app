import { ReactNode } from "react";
import styles from "./LoginFooterCard.module.css";

interface LoginFooterCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
}

export default function LoginFooterCard({ icon, title, description, color }: LoginFooterCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.icon} style={color ? { color, backgroundColor: `${color}22` } : undefined}>{icon}</span>
      <div className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </div>
    </div>
  );
}
