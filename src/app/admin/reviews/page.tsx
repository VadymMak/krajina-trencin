import { prisma } from '@/lib/prisma';
import ReviewsTable from './ReviewsTable';
import styles from '../admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });

  const serialized = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Recenzie ({reviews.length})</h1>
      </div>
      <div className={styles.card}>
        <ReviewsTable reviews={serialized} />
      </div>
    </>
  );
}
