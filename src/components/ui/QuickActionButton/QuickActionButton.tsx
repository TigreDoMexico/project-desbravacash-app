import { ReactNode } from "react";
import styles from "./QuickActionButton.module.css";

interface QuickActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export default function QuickActionButton({ icon, label, onClick }: QuickActionButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
