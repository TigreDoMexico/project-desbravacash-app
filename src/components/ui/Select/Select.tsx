import { ReactNode } from "react";
import styles from "./Select.module.css";

interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  icon?: ReactNode;
  children: React.ReactNode;
}

export default function Select({ label, id, icon, children, ...props }: SelectProps) {
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <select
          id={id}
          className={icon ? styles.withIcon : styles.select}
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
}
