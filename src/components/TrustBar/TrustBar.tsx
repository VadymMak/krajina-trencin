'use client';

import { useTranslations } from 'next-intl';
import styles from './TrustBar.module.css';

export default function TrustBar() {
  const t = useTranslations('trust');

  const items = [
    { value: t('products_num'),  label: t('products_label')  },
    { value: t('countries_num'), label: t('countries_label') },
    { value: t('shipping_num'),  label: t('shipping_label')  },
    { value: t('store_icon'),    label: t('store_label')     },
  ] as const;

  return (
    <section className={styles.trustBar}>
      <div className={styles.inner}>
        {items.map((item, i) => (
          <div key={i} className={styles.itemWrap}>
            {i > 0 && <div className={styles.divider} aria-hidden="true" />}
            <div className={styles.item}>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
