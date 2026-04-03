import { prisma } from '@/lib/prisma';
import ProductsList from './ProductsList';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { country: 'asc' },
    select:  { id: true, slug: true, name: true, price: true, image: true, flag: true, country: true, inStock: true },
  });

  return <ProductsList products={products} />;
}
