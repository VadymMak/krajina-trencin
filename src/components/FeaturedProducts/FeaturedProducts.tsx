'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { PLACEHOLDER_PRODUCTS, COUNTRY_FLAGS } from '@/data/products';
import styles from './FeaturedProducts.module.css';

const FEATURED = PLACEHOLDER_PRODUCTS.slice(0, 8);

export default function FeaturedProducts() {
  const t      = useTranslations('featured');
  const locale = useLocale();

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
