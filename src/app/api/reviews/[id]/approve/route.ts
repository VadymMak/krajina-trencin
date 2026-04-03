import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function isAdmin() {
  const store = await cookies();
  return store.get('admin_token')?.value === process.env.ADMIN_SECRET;
}

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const review = await prisma.review.update({
    where: { id: Number(id) },
    data: { approved: true },
  });
  return NextResponse.json(review);
}
