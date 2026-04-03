'use client';

import { useState } from 'react';
import { useBasketActions } from '@/context/BasketContext';
import styles from './page.module.css';

interface Props {
  product: {
    id: number;
    slug: string;
    name: string;
    price: number;
    image: string | null;
    flag: string;
    country: string;
  };
  addLabel: string;
}

export default function ProductActions({ product, addLabel }: Props) {
  const [qty, setQty] = useState(1);
  const { addItem, toggleDrawer } = useBasketActions();

  function dec() { setQty((q) => Math.max(1, q - 1)); }
  function inc() { setQty((q) => Math.min(99, q + 1)); }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v)) setQty(Math.min(99, Math.max(1, v)));
  }

  function addToBasket() {
    addItem({
      id:      product.id,
      slug:    product.slug,
      name:    product.name,
      price:   product.price,
      image:   product.image,
      flag:    product.flag,
      country: product.country,
    }, qty);
    toggleDrawer(true);
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
