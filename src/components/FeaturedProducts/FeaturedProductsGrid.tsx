'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useBasketActions } from '@/context/BasketContext';
import styles from './FeaturedProducts.module.css';

export interface FeaturedProduct {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  flag: string;
  country: string;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

interface Props {
  products: FeaturedProduct[];
}

export default function FeaturedProductsGrid({ products }: Props) {
  const t      = useTranslations('featured');
  const locale = useLocale();
  const { addItem, toggleDrawer } = useBasketActions();

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <div className={styles.header}>
          <p className={styles.label}>{t('label')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <Link key={product.id} href={`/${locale}/products/${product.slug}`} className={styles.card}>
              <div className={styles.imageWrap}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    unoptimized={product.image.startsWith('https://')}
                  />
                ) : (
                  <div className={styles.placeholder} aria-hidden="true" />
                )}
                <span className={styles.flag} aria-hidden="true">{product.flag}</span>
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
              <div className={styles.body}>
                <span className={styles.name}>{product.name}</span>
                <span className={styles.price}>{formatPrice(product.price)}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <Link href={`/${locale}/products`} className={styles.ctaBtn}>
            {t('cta')}
          </Link>
        </div>

      </div>
    </section>
  );
}
