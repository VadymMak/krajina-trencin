'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useBasketActions } from '@/context/BasketContext';
import ProductsFilter, {
  FILTER_CATEGORIES,
  type FilterCategory,
} from '@/components/ProductsFilter/ProductsFilter';
import styles from './products.module.css';

export interface DbProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  flag: string;
  country: string;
  inStock: boolean;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

const ALL = 'all' as const;

export default function ProductsList({ products }: { products: DbProduct[] }) {
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
    ? products
    : products.filter((p) => p.country === active);

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
            ? FILTER_CATEGORIES
                .filter((countryId) => products.some((p) => p.country === countryId))
                .map((countryId) => {
                  const items = products.filter((p) => p.country === countryId);
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
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </section>
                  );
                })
            : (
              <div className={styles.grid}>
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )
          }
        </div>
      </main>
    </>
  );
}

function ProductCard({ product }: { product: DbProduct }) {
  const locale = useLocale();
  const t = useTranslations('featured');
  const { addItem, toggleDrawer } = useBasketActions();

  return (
    <Link href={`/${locale}/products/${product.slug}`} className={styles.card}>
      <div className={styles.cardImageWrap}>
        <div className={styles.cardImage}>
          {product.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
        </div>
        <button
          className={styles.quickAdd}
          aria-label={t('quickAdd')}
          onClick={(e) => {
            e.preventDefault();
            addItem({
              id:      product.id,
              slug:    product.slug,
              name:    product.name,
              price:   product.price,
              image:   product.image,
              flag:    product.flag,
              country: product.country,
            }, 1);
            toggleDrawer(true);
          }}
        >
          +
        </button>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardName}>{product.name}</span>
        <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}
