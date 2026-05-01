import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({ loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button className={styles.button} disabled={loading || disabled} {...props}>
      {loading ? "Carregando..." : children}
    </button>
  );
}
