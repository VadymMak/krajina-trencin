import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductsTable from './ProductsTable';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Produkty ({products.length})</h1>
        <Link href="/admin/products/new" className={styles.btnPrimary}>
          + Pridať produkt
        </Link>
      </div>
      <div className={styles.card}>
        <ProductsTable products={products} />
      </div>
    </>
  );
}
