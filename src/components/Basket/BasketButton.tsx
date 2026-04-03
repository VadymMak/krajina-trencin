'use client';

import { useTranslations } from 'next-intl';
import { useBasket, useBasketActions } from '@/context/BasketContext';
import styles from './BasketButton.module.css';

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6h18M16 10a4 4 0 01-8 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BasketButton() {
  const t                = useTranslations('basket');
  const { count }        = useBasket();
  const { toggleDrawer } = useBasketActions();

  return (
    <div className={styles.wrap}>
      <button
        className={styles.btn}
        onClick={() => toggleDrawer(true)}
        aria-label={t('title')}
      >
        <BagIcon />
      </button>
      {count > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}
