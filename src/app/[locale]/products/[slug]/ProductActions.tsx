'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface Props {
  product: { id: number; name: string; price: number; slug: string };
  addLabel: string;
}

export default function ProductActions({ product, addLabel }: Props) {
  const [qty, setQty] = useState(1);

  function dec() { setQty((q) => Math.max(1, q - 1)); }
  function inc() { setQty((q) => Math.min(99, q + 1)); }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v)) setQty(Math.min(99, Math.max(1, v)));
  }

  function addToBasket() {
    console.log('addToBasket', { product, quantity: qty });
  }

  return (
    <div className={styles.actions}>
      <div className={styles.qty}>
        <button className={styles.qtyBtn} onClick={dec} aria-label="−">−</button>
        <input
          className={styles.qtyInput}
          type="number"
          value={qty}
          min={1}
          max={99}
          onChange={onChange}
        />
        <button className={styles.qtyBtn} onClick={inc} aria-label="+">+</button>
      </div>
      <button className={styles.addBtn} onClick={addToBasket}>
        {addLabel}
      </button>
    </div>
  );
}
