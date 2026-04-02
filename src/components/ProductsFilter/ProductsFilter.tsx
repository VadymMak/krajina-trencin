'use client';

declare global {
  interface Window { __programmaticScroll: boolean; }
}

import { useTranslations } from 'next-intl';
import styles from './ProductsFilter.module.css';

export const FILTER_CATEGORIES = [
  'taliansko',
  'azia',
  'francuzsko',
  'grecko',
  'spanielsko',
  'ukrajina',
  'india',
] as const;

export type FilterCategory = (typeof FILTER_CATEGORIES)[number] | 'all';

const ALL = 'all' as const;

interface ProductsFilterProps {
  active: FilterCategory;
  onSelect: (id: FilterCategory) => void;
}

export default function ProductsFilter({ active, onSelect }: ProductsFilterProps) {
  const t = useTranslations('products');

  const filters: FilterCategory[] = [ALL, ...FILTER_CATEGORIES];

  return (
    <div
      className={styles.filterBar}
      style={{
        position: 'fixed',
        top: 'calc(var(--header-visible, 1) * var(--header-height, 64px))',
        left: 0,
        right: 0,
        zIndex: 99,
        transition: 'top 0.3s ease',
      }}
    >
      <div className={styles.filterInner}>
        {filters.map((id) => (
          <button
            key={id}
            className={`${styles.filterBtn} ${active === id ? styles.filterBtnActive : ''}`}
            onClick={() => onSelect(id)}
          >
            {t(`categories.${id}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
