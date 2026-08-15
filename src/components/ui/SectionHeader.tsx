import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  right?: React.ReactNode;
};

export function SectionHeader({ eyebrow, title, right }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title}>{title}</h2>
      </div>
      {right ? <div className={styles.right}>{right}</div> : null}
    </header>
  );
}
