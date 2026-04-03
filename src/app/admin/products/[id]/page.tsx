import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '../ProductForm';
import { ProductFormTitle } from '../ProductFormTitle';

type Params = Promise<{ id: string }>;

export default async function AdminEditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  const initialData = {
    id:                   product.id,
    name:                 product.name,
    slug:                 product.slug,
    country:              product.country,
    flag:                 product.flag,
    price:                product.price,
    description:          product.description ?? '',
    descriptionCs:        product.descriptionCs ?? '',
    descriptionEn:        product.descriptionEn ?? '',
    descriptionUk:        product.descriptionUk ?? '',
    descriptionGenerated: product.descriptionGenerated,
    image:                product.image ?? '',
    inStock:              product.inStock,
    featured:             product.featured,
  };

  return (
    <>
      <ProductFormTitle mode="edit" name={product.name} />
      <ProductForm mode="edit" initialData={initialData} />
    </>
  );
}
