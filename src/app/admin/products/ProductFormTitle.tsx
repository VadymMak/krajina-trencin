'use client';

import styles from '../admin.module.css';
import { useAdminTranslations } from '../i18n/useAdminTranslations';

export function ProductFormTitle({ mode, name }: { mode: 'new' | 'edit'; name?: string }) {
  const { t } = useAdminTranslations();
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>
        {mode === 'new' ? t.newProduct : `${t.editProduct}: ${name}`}
      </h1>
    </div>
  );
}
