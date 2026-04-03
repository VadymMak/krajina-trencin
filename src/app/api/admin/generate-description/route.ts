import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI not configured' }, { status: 503 });
  }

  const { name, country, flag, productId } = await request.json();

  // If product already has generated descriptions, return 409
  if (productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { descriptionGenerated: true },
    });
    if (product?.descriptionGenerated) {
      return NextResponse.json({ error: 'Already generated' }, { status: 409 });
    }
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a product description writer for a gourmet food store. ' +
            'Always respond with a valid JSON object containing exactly 4 keys: sk, cs, en, uk. ' +
            'Each value is a short appetizing product description (2-3 sentences). ' +
            'sk = Slovak, cs = Czech, en = English, uk = Ukrainian.',
        },
        {
          role: 'user',
          content: `Write descriptions for: ${name} ${flag} from ${country}. Return JSON only.`,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'OpenAI error' }, { status: 502 });
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim() ?? '{}';

  let descriptions: { sk?: string; cs?: string; en?: string; uk?: string } = {};
  try {
    descriptions = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid AI response' }, { status: 502 });
  }

  // Persist to DB if productId provided
  if (productId) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        description:          descriptions.sk ?? '',
        descriptionCs:        descriptions.cs ?? null,
        descriptionEn:        descriptions.en ?? null,
        descriptionUk:        descriptions.uk ?? null,
        descriptionGenerated: true,
      },
    });
  }

  return NextResponse.json({ description: descriptions });
}
