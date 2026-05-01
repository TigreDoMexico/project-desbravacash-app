import styles from './LoginBackground.module.css'

export default function LoginBackground({ children }: { children: React.ReactNode }) {
  return (
   <div className={styles.wrapper}>
      <div className={styles.background}>
        <svg className={styles.curve} viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,200 C480,100 960,0 1440,100 L1440,0 L0,0 Z" />
        </svg>

        <div className={styles.bottom}></div>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}