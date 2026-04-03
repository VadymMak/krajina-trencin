import { prisma } from '@/lib/prisma';
import ProductsTable from './ProductsTable';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
  return <ProductsTable products={products} count={products.length} />;
}
