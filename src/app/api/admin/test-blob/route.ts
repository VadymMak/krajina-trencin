import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    hasToken:   !!process.env.BLOB_READ_WRITE_TOKEN,
    tokenStart: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) ?? null,
  });
}
