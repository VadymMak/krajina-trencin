'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useBasket, useBasketActions } from '@/context/BasketContext';
import BasketItem from './BasketItem';
import styles from './BasketDrawer.module.css';

function fmt(price: number) {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export default function BasketDrawer() {
  const t               = useTranslations('basket');
  const locale          = useLocale();
  const { items, isOpen, total, count } = useBasket();
  const { toggleDrawer } = useBasketActions();

  if (!isOpen) return null;

  function getCountLabel(n: number): string {
    if (n === 0) return t('items_0');
    if (n === 1) return t('items_1');
    if (n <= 4)  return t('items_2_4').replace('{count}', n.toString());
    return t('items_5').replace('{count}', n.toString());
  }

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={() => toggleDrawer(false)} />

      {/* Drawer */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label={t('title')}>

        {/* Header */}
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <span className={styles.title}>{t('title')}</span>
            <span className={styles.count}>({getCountLabel(count)})</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => toggleDrawer(false)}
            aria-label={t('continueShopping')}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🛒</span>
              <p className={styles.emptyText}>{t('empty')}</p>
              <p className={styles.emptySubtext}>{t('emptySubtext')}</p>
              <Link
                href={`/${locale}/products`}
                className={styles.emptyLink}
                onClick={() => toggleDrawer(false)}
              >
                {t('continueShopping')}
              </Link>
            </div>
          ) : (
            items.map((item) => <BasketItem key={item.id} item={item} />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.foot}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>{t('total')}</span>
              <span className={styles.totalPrice}>{fmt(total)}</span>
            </div>

            {total >= 60 ? (
              <p className={styles.deliveryFree}>{t('freeShipping')}</p>
            ) : (
              <p className={styles.deliveryNote}>{t('freeShippingFrom')}</p>
            )}

            <Link
              href={`/${locale}/checkout`}
              className={styles.checkoutBtn}
              onClick={() => toggleDrawer(false)}
            >
              {t('checkout')}
            </Link>

            <button className={styles.continueBtn} onClick={() => toggleDrawer(false)}>
              {t('continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
