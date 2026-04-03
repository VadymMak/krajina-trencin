import { prisma } from '@/lib/prisma';
import ReviewsTable from './ReviewsTable';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  const serialized = reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  return <ReviewsTable reviews={serialized} count={reviews.length} />;
}
