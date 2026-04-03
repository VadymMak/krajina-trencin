import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import sharp from 'sharp';

const MAX_SIZE    = 20 * 1024 * 1024; // 20 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export async function POST(request: NextRequest) {
  console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not set');
    return NextResponse.json({ error: 'Storage not configured (BLOB_READ_WRITE_TOKEN missing)' }, { status: 503 });
  }

  const formData = await request.formData();
  const file    = formData.get('file')    as File | null;
  const country = formData.get('country') as string | null ?? 'other';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  console.log('File size:', file.size, 'File type:', file.type);

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 20 MB.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let processedBuffer: Buffer;
  try {
    processedBuffer = await sharp(buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch (sharpError) {
    console.error('Sharp processing error:', sharpError);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }

  const originalName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  const filename = `products/${country}/${Date.now()}-${originalName}.webp`;

  try {
    const blob = await put(filename, processedBuffer, {
      access: 'public',
      contentType: 'image/webp',
    });

    return NextResponse.json({
      url:           blob.url,
      originalSize:  buffer.length,
      optimizedSize: processedBuffer.length,
      savings:       Math.round((1 - processedBuffer.length / buffer.length) * 100),
    });
  } catch (blobError) {
    console.error('Vercel Blob upload error:', blobError);
    return NextResponse.json({ error: 'Storage upload failed' }, { status: 500 });
  }
}
