import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import ProductActions from './ProductActions';
import styles from './page.module.css';

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return {
    title: `${product?.name} | Krajina`,
    description: product?.description,
  };
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' €';
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const t  = await getTranslations('productDetail');
  const tn = await getTranslations('nav');
  const tp = await getTranslations('products');

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { country: product.country, slug: { not: slug } },
    take: 4,
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link href={`/${locale}`} className={styles.breadcrumbLink}>{tn('home')}</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href={`/${locale}/products`} className={styles.breadcrumbLink}>{tn('products')}</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* Back */}
        <Link href={`/${locale}/products`} className={styles.back}>
          ← {t('back')}
        </Link>

        {/* Product grid */}
        <div className={styles.productGrid}>

          {/* Left — image */}
          <div className={styles.imageWrap}>
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className={styles.imagePlaceholder} aria-hidden="true" />
            )}
          </div>

          {/* Right — info */}
          <div className={styles.info}>

            {/* Country badge */}
            <span className={styles.badge}>
              {product.flag}&nbsp;{tp(`categories.${product.country}`)}
            </span>

            {/* Name */}
            <h1 className={styles.name}>{product.name}</h1>

            {/* Price */}
            <p className={styles.price}>{formatPrice(product.price)}</p>

            {/* Divider */}
            <hr className={styles.divider} />

            {/* Description */}
            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}

            {/* Qty + Add to basket */}
            <ProductActions
              product={{
                id:      product.id,
                slug:    product.slug,
                name:    product.name,
                price:   product.price,
                image:   product.image ?? null,
                flag:    product.flag,
                country: product.country,
              }}
              addLabel={t('addToBasket')}
            />

            {/* Stock badge */}
            <span className={product.inStock ? styles.stockIn : styles.stockOut}>
              {product.inStock ? t('inStock') : t('outOfStock')}
            </span>

            {/* Delivery info */}
            <div className={styles.delivery}>
              <span className={styles.deliveryIcon}>⚡</span>
              <p className={styles.deliveryText}>{t('delivery')}</p>
            </div>

          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>{t('related')}</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/products/${p.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImageWrap}>
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className={styles.relatedImage}
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className={styles.relatedPlaceholder} aria-hidden="true" />
                    )}
                    <span className={styles.relatedFlag} aria-hidden="true">{p.flag}</span>
                  </div>
                  <div className={styles.relatedBody}>
                    <span className={styles.relatedName}>{p.name}</span>
                    <span className={styles.relatedPrice}>{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
