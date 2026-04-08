'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useBasket } from '@/context/BasketContext';
import { DELIVERY_THRESHOLD, DELIVERY_PRICE } from '@/lib/config';
import styles from './page.module.css';

interface CustomerInfo {
  name:    string;
  email:   string;
  phone:   string;
  address: string;
  city:    string;
  zip:     string;
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export default function CheckoutPage() {
  const t      = useTranslations('checkout');
  const locale = useLocale();
  const router = useRouter();
  const { items, total } = useBasket();

  const [form, setForm] = useState<CustomerInfo>({
    name: '', email: '', phone: '', address: '', city: '', zip: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Feature flag guard
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_PAYMENTS !== 'true') {
      router.replace(`/${locale}/products`);
    }
  }, [locale, router]);

  // Empty basket guard
  useEffect(() => {
    if (items.length === 0) {
      router.replace(`/${locale}/products`);
    }
  }, [items, locale, router]);

  const deliveryCost  = total >= DELIVERY_THRESHOLD ? 0 : DELIVERY_PRICE;
  const grandTotal    = total + deliveryCost;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customerInfo: form, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setLoading(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        <div className={styles.layout}>

          {/* ── LEFT: Order summary ── */}
          <section className={styles.summary}>
            <h2 className={styles.sectionTitle}>{t('summary')}</h2>

            <ul className={styles.itemList}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className={styles.itemImg}
                        sizes="56px"
                      />
                    ) : (
                      <div className={styles.itemPlaceholder} aria-hidden="true" />
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.flag}&nbsp;{item.name}</span>
                    <span className={styles.itemQty}>× {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>{t('subtotal')}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>{t('delivery')}</span>
                <span>{deliveryCost === 0 ? t('deliveryFree') : t('deliveryPrice')}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
                <span>{t('total')}</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </section>

          {/* ── RIGHT: Customer form ── */}
          <section className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {(['name', 'email', 'phone', 'address', 'city', 'zip'] as const).map((field) => (
                <div key={field} className={styles.field}>
                  <label className={styles.label} htmlFor={`field-${field}`}>
                    {t(`fields.${field}`)}
                  </label>
                  <input
                    id={`field-${field}`}
                    className={styles.input}
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    required
                    autoComplete={field === 'email' ? 'email' : field === 'name' ? 'name' : 'off'}
                  />
                </div>
              ))}

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.payBtn}
                disabled={loading}
              >
                {loading ? '…' : `${t('pay')} — ${formatPrice(grandTotal)}`}
              </button>

              <div className={styles.secureRow}>
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true">
                  <path d="M7 1L1 4v5c0 3.31 2.56 6.41 6 7 3.44-.59 6-3.69 6-7V4L7 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
                <span>{t('secure')}</span>
              </div>
            </form>
          </section>

        </div>
      </div>
    </main>
  );
}
