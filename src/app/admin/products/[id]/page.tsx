import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '../ProductForm';
import styles from '../../admin.module.css';

type Params = Promise<{ id: string }>;

export default async function AdminEditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  const initialData = {
    id:          product.id,
    name:        product.name,
    slug:        product.slug,
    country:     product.country,
    flag:        product.flag,
    price:       product.price,
    description: product.description ?? '',
    image:       product.image ?? '',
    inStock:     product.inStock,
    featured:    product.featured,
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Upraviť: {product.name}</h1>
      </div>
      <ProductForm mode="edit" initialData={initialData} />
    </>
  );
}
