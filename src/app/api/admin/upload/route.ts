import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const country = (formData.get('country') as string | null) ?? 'other';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const processedBuffer = await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  const originalName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  const filename = `${Date.now()}-${originalName}.webp`;

  const dir = path.join(process.cwd(), 'public', 'images', 'products', country);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), processedBuffer);

  return NextResponse.json({
    url:           `/images/products/${country}/${filename}`,
    originalSize:  buffer.length,
    optimizedSize: processedBuffer.length,
    savings:       Math.round((1 - processedBuffer.length / buffer.length) * 100),
  });
}
