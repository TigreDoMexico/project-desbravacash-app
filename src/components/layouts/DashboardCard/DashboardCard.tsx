import { ReactNode } from "react";
import styles from "./DashboardCard.module.css";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <div className={`${styles.card}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
