'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductsFilter, {
  FILTER_CATEGORIES,
  type FilterCategory,
} from '@/components/ProductsFilter/ProductsFilter';
import styles from './products.module.css';

const ALL = 'all' as const;

// Placeholder данные — заменить на реальные продукты
const PLACEHOLDER_PRODUCTS: {
  id: string;
  name: string;
  country: FilterCategory;
  price: string;
}[] = [
  { id: '1',  name: 'San Marzano paradajky',  country: 'taliansko',  price: '3,90 €' },
  { id: '2',  name: 'Parmigiano Reggiano',    country: 'taliansko',  price: '12,50 €' },
  { id: '3',  name: 'Prosciutto di Parma',    country: 'taliansko',  price: '18,00 €' },
  { id: '4',  name: 'Pasta di Gragnano',      country: 'taliansko',  price: '4,20 €' },
  { id: '5',  name: 'Japonská sójová omáčka', country: 'azia',       price: '5,50 €' },
  { id: '6',  name: 'Thajská curry pasta',    country: 'azia',       price: '4,90 €' },
  { id: '7',  name: 'Kokosové mlieko',        country: 'azia',       price: '2,80 €' },
  { id: '8',  name: 'Ryžové rezance',         country: 'azia',       price: '3,20 €' },
  { id: '9',  name: 'Dijonská horčica',       country: 'francuzsko', price: '4,50 €' },
  { id: '10', name: 'Herbes de Provence',     country: 'francuzsko', price: '5,90 €' },
  { id: '11', name: 'Crème de marrons',       country: 'francuzsko', price: '7,20 €' },
  { id: '12', name: 'Cassoulet',              country: 'francuzsko', price: '8,90 €' },
  { id: '13', name: 'Kalamata olivy',         country: 'grecko',     price: '6,50 €' },
  { id: '14', name: 'Feta DOP',               country: 'grecko',     price: '9,90 €' },
  { id: '15', name: 'Grécky med',             country: 'grecko',     price: '11,00 €' },
  { id: '16', name: 'Manchego syr',           country: 'spanielsko', price: '13,50 €' },
  { id: '17', name: 'Chorizo Ibérico',        country: 'spanielsko', price: '15,00 €' },
  { id: '18', name: 'Slnečnicová halva',      country: 'ukrajina',   price: '5,90 €' },
  { id: '19', name: 'Pohánkový med',          country: 'ukrajina',   price: '8,50 €' },
  { id: '20', name: 'Masala korenie',         country: 'india',      price: '6,20 €' },
  { id: '21', name: 'Basmati ryža',           country: 'india',      price: '4,80 €' },
  { id: '22', name: 'Mango chutney',          country: 'india',      price: '5,40 €' },
  { id: '23', name: 'Coconut oil',            country: 'india',      price: '7,90 €' },
];

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

function ProductCard({ name, price }: { id: string; name: string; country: FilterCategory; price: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage} aria-hidden="true" />
      <div className={styles.cardBody}>
        <span className={styles.cardName}>{name}</span>
        <span className={styles.cardPrice}>{price}</span>
      </div>
    </div>
  );
}
