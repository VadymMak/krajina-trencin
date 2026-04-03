'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useBasketActions } from '@/context/BasketContext';
import ProductsFilter, {
  FILTER_CATEGORIES,
  type FilterCategory,
} from '@/components/ProductsFilter/ProductsFilter';
import { PLACEHOLDER_PRODUCTS, COUNTRY_FLAGS } from '@/data/products';
import styles from './products.module.css';

const ALL = 'all' as const;

export default function ProductsPage() {
  const t = useTranslations('products');
  const [active, setActive] = useState<FilterCategory>(ALL);

  function handleFilter(id: FilterCategory) {
    setActive(id);
    if (id === ALL) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (!el) return;
      const cs = getComputedStyle(document.documentElement);
      const headerVisible = parseFloat(cs.getPropertyValue('--header-visible')) || 1;
      const headerHeight  = parseInt(cs.getPropertyValue('--header-height'))    || 64;
      const filterHeight  = 48;
      const offset = headerVisible * headerHeight + filterHeight + 16;
      window.__programmaticScroll = true;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
      setTimeout(() => { window.__programmaticScroll = false; }, 800);
    }
  }

  const filtered = active === ALL
    ? PLACEHOLDER_PRODUCTS
    : PLACEHOLDER_PRODUCTS.filter((p) => p.country === active);

  return (
    <>
      <ProductsFilter active={active} onSelect={handleFilter} />

      <main
        className={styles.main}
        style={{ paddingTop: 'calc(var(--header-height, 64px) + 48px)' }}
      >
        <div className={styles.container}>

          <div className={styles.pageHeader}>
            <p className={styles.pageLabel}>{t('label')}</p>
            <h1 className={styles.pageTitle}>{t('title')}</h1>
            <div className={styles.pageDivider} />
          </div>

          {active === ALL
            ? FILTER_CATEGORIES.map((countryId) => {
                const items = PLACEHOLDER_PRODUCTS.filter((p) => p.country === countryId);
                return (
                  <section key={countryId} id={countryId} className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>
                        {t(`categories.${countryId}`)}
                      </h2>
                      <div className={styles.sectionDivider} />
                    </div>
                    <div className={styles.grid}>
                      {items.map((product) => (
                        <ProductCard key={product.id} {...product} />
                      ))}
                    </div>
                  </section>
                );
              })
            : (
              <div className={styles.grid}>
                {filtered.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )
          }
        </div>
      </main>
    </>
  );
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function parsePrice(price: string): number {
  return parseFloat(price.replace(',', '.').replace(/[^0-9.]/g, ''));
}

function ProductCard({ id, name, country, price }: { id: string; name: string; country: FilterCategory; price: string }) {
  const locale = useLocale();
  const t = useTranslations('featured');
  const { addItem, toggleDrawer } = useBasketActions();

  return (
    <Link href={`/${locale}/products/${toSlug(name)}`} className={styles.card}>
      <div className={styles.cardImageWrap}>
        <div className={styles.cardImage} aria-hidden="true" />
        {country !== 'all' && (
          <button
            className={styles.quickAdd}
            aria-label={t('quickAdd')}
            onClick={(e) => {
              e.preventDefault();
              addItem({
                id:      parseInt(id),
                slug:    toSlug(name),
                name,
                price:   parsePrice(price),
                image:   null,
                flag:    COUNTRY_FLAGS[country],
                country,
              }, 1);
              toggleDrawer(true);
            }}
          >
            +
          </button>
        )}
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardName}>{name}</span>
        <span className={styles.cardPrice}>{price}</span>
      </div>
    </Link>
  );
}
