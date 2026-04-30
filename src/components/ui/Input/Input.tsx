import { ReactNode } from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  icon?: ReactNode;
}

export default function Input({ label, id, icon, ...props }: InputProps) {
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input id={id} className={icon ? styles.withIcon : undefined} {...props} />
      </div>
    </div>
  );
}
