'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useBasketActions } from '@/context/BasketContext';
import styles from './page.module.css';

export default function CheckoutSuccessPage() {
  const t             = useTranslations('checkout');
  const locale        = useLocale();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const { clearBasket } = useBasketActions();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      router.replace(`/${locale}/products`);
      return;
    }
    clearBasket();
  }, [sessionId, locale, router, clearBasket]);

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="var(--color-green)" opacity="0.12"/>
            <circle cx="28" cy="28" r="22" fill="var(--color-green)" opacity="0.18"/>
            <path d="M18 28l7 7 13-14" stroke="var(--color-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className={styles.title}>{t('thankYou')}</h1>
        <p className={styles.text}>{t('orderConfirmed')}</p>

        {sessionId && (
          <p className={styles.sessionId}>ID: {sessionId.slice(-12)}</p>
        )}

        <Link href={`/${locale}/products`} className={styles.cta}>
          {t('continueShopping')}
        </Link>
      </div>
    </main>
  );
}
