import styles from '../admin.module.css';

export default function AdminOrdersPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Objednávky</h1>
      </div>
      <div className={styles.card}>
        <div className={styles.empty}>
          🛒 Správa objednávok bude implementovaná po integrácii platobnej brány.
        </div>
      </div>
    </>
  );
}
