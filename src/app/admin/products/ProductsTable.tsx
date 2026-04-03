'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';
import { useAdminTranslations } from '../i18n/useAdminTranslations';

interface Product {
  id: number;
  name: string;
  country: string;
  flag: string;
  price: number;
  image: string | null;
  inStock: boolean;
  featured: boolean;
}

interface Props {
  products: Product[];
  count: number;
}

export default function ProductsTable({ products, count }: Props) {
  const router = useRouter();
  const { t }  = useAdminTranslations();

  async function deleteProduct(id: number, name: string) {
    if (!confirm(`${t.delete} "${name}"?`)) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  async function toggleStock(id: number, current: boolean) {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !current }),
    });
    router.refresh();
  }

  async function toggleFeatured(id: number, current: boolean) {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !current }),
    });
    router.refresh();
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t.products} ({count})</h1>
        <Link href="/admin/products/new" className={styles.btnPrimary}>
          {t.addProduct}
        </Link>
      </div>

      <div className={styles.card}>
        {products.length === 0 ? (
          <div className={styles.empty}>{t.noProducts}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t.image}</th>
                <th>{t.name}</th>
                <th>{t.country}</th>
                <th>{t.price}</th>
                <th>{t.stock}</th>
                <th>{t.featured}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, display: 'block' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.webp';
                          e.currentTarget.onerror = null;
                        }}
                      />
                    ) : (
                      <div className={styles.imgPlaceholder}>🏷️</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.flag} {p.country}</td>
                  <td>{p.price.toFixed(2).replace('.', ',')} €</td>
                  <td>
                    <button
                      className={p.inStock ? styles.badgeGreen : styles.badgeRed}
                      onClick={() => toggleStock(p.id, p.inStock)}
                      style={{ cursor: 'pointer', border: 'none', borderRadius: 4 }}
                    >
                      {p.inStock ? t.inStock : t.outOfStock}
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => toggleFeatured(p.id, p.featured)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                    >
                      {p.featured ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/products/${p.id}`} className={styles.btnIcon} title={t.edit}>
                        ✏️
                      </Link>
                      <button
                        className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                        onClick={() => deleteProduct(p.id, p.name)}
                        title={t.delete}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
