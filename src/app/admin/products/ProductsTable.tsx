'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';

interface Product {
  id: number;
  name: string;
  country: string;
  flag: string;
  price: number;
  inStock: boolean;
  featured: boolean;
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();

  async function deleteProduct(id: number, name: string) {
    if (!confirm(`Vymazať produkt "${name}"?`)) return;
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

  if (products.length === 0) {
    return <div className={styles.empty}>Žiadne produkty. Pridajte prvý produkt.</div>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Obrázok</th>
          <th>Názov</th>
          <th>Krajina</th>
          <th>Cena</th>
          <th>Sklad</th>
          <th>Odporúčané</th>
          <th>Akcie</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>
              <div className={styles.imgPlaceholder}>🏷️</div>
            </td>
            <td style={{ fontWeight: 500 }}>{p.name}</td>
            <td>{p.flag} {p.country}</td>
            <td>{p.price.toFixed(2).replace('.', ',')} €</td>
            <td>
              <button
                className={p.inStock ? styles.badgeGreen : styles.badgeRed}
                onClick={() => toggleStock(p.id, p.inStock)}
                style={{ cursor: 'pointer', border: 'none', borderRadius: 4 }}
                title="Kliknite pre zmenu"
              >
                {p.inStock ? 'Na sklade' : 'Nedostupné'}
              </button>
            </td>
            <td style={{ textAlign: 'center' }}>
              <button
                onClick={() => toggleFeatured(p.id, p.featured)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                title={p.featured ? 'Odstraniť z odporúčaných' : 'Pridať do odporúčaných'}
              >
                {p.featured ? '⭐' : '☆'}
              </button>
            </td>
            <td>
              <div className={styles.actions}>
                <Link href={`/admin/products/${p.id}`} className={styles.btnIcon} title="Upraviť">
                  ✏️
                </Link>
                <button
                  className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                  onClick={() => deleteProduct(p.id, p.name)}
                  title="Vymazať"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
