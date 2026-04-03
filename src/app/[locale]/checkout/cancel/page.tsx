'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useBasketActions } from '@/context/BasketContext';
import styles from './page.module.css';

export default function CheckoutCancelPage() {
  const t              = useTranslations('checkout');
  const locale         = useLocale();
  const { toggleDrawer } = useBasketActions();

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="var(--color-accent)" opacity="0.10"/>
            <circle cx="28" cy="28" r="22" fill="var(--color-accent)" opacity="0.15"/>
            <path d="M20 20l16 16M36 20L20 36" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className={styles.title}>{t('cancelTitle')}</h1>
        <p className={styles.text}>{t('cancelText')}</p>

        <button className={styles.ctaBasket} onClick={() => toggleDrawer(true)}>
          {t('backToBasket')}
        </button>

        <Link href={`/${locale}/products`} className={styles.ctaLink}>
          {t('continueShopping')}
        </Link>
      </div>
    </main>
  );
}
