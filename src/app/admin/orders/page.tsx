import { prisma } from '@/lib/prisma';
import OrdersTable from './OrdersTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const raw = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  // Serialize dates to strings for client component
  const orders = raw.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  return <OrdersTable orders={orders} />;
}
