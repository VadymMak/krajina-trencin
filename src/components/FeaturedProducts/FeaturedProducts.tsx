import { prisma } from '@/lib/prisma';
import FeaturedProductsGrid from './FeaturedProductsGrid';

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where:   { featured: true, inStock: true },
    take:    8,
    orderBy: { createdAt: 'desc' },
    select:  { id: true, slug: true, name: true, price: true, image: true, flag: true, country: true },
  });

  return <FeaturedProductsGrid products={products} />;
}
