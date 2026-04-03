'use client';

import Image from 'next/image';
import { useBasketActions } from '@/context/BasketContext';
import type { BasketItem as IBasketItem } from '@/context/BasketContext';
import styles from './BasketItem.module.css';

function fmt(price: number) {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export default function BasketItem({ item }: { item: IBasketItem }) {
  const { updateQty, removeItem } = useBasketActions();

  return (
    <div className={styles.item}>
      {/* Remove */}
      <button
        className={styles.removeBtn}
        onClick={() => removeItem(item.id)}
        aria-label="Odstrániť"
      >
        ×
      </button>

      {/* Image */}
      <div className={styles.imageWrap}>
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className={styles.image} sizes="64px" />
        ) : (
          <div className={styles.imagePlaceholder}>{item.flag}</div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.meta}>{item.flag} {item.country}</p>
        <p className={styles.name}>{item.name}</p>
        <p className={styles.unitPrice}>{fmt(item.price)} / ks</p>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <span className={styles.lineTotal}>{fmt(item.price * item.quantity)}</span>
        <div className={styles.qtyRow}>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQty(item.id, item.quantity - 1)}
          >
            −
          </button>
          <input
            className={styles.qtyNum}
            type="number"
            min={1}
            max={99}
            value={item.quantity}
            onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
          />
          <button
            className={styles.qtyBtn}
            onClick={() => updateQty(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
