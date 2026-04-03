'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { PLACEHOLDER_PRODUCTS, COUNTRY_FLAGS } from '@/data/products';
import { useBasketActions } from '@/context/BasketContext';
import styles from './FeaturedProducts.module.css';

const FEATURED = PLACEHOLDER_PRODUCTS.slice(0, 8);

function parsePrice(price: string): number {
  return parseFloat(price.replace(',', '.').replace(/[^0-9.]/g, ''));
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function FeaturedProducts() {
  const t      = useTranslations('featured');
  const locale = useLocale();
  const { addItem, toggleDrawer } = useBasketActions();

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.label}>{t('label')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {FEATURED.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrap}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className={styles.placeholder} aria-hidden="true" />
                )}
                <span className={styles.flag} aria-hidden="true">
                  {COUNTRY_FLAGS[product.country]}
                </span>
                <button
                  className={styles.quickAdd}
                  aria-label={t('quickAdd')}
                  onClick={() => {
                    addItem({
                      id:      parseInt(product.id),
                      slug:    toSlug(product.name),
                      name:    product.name,
                      price:   parsePrice(product.price),
                      image:   product.image ?? null,
                      flag:    COUNTRY_FLAGS[product.country],
                      country: product.country,
                    }, 1);
                    toggleDrawer(true);
                  }}
                >
                  +
                </button>
              </div>
              <div className={styles.body}>
                <span className={styles.name}>{product.name}</span>
                <span className={styles.price}>{product.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.ctaWrap}>
          <Link href={`/${locale}/products`} className={styles.ctaBtn}>
            {t('cta')}
          </Link>
        </div>

      </div>
    </section>
  );
}
