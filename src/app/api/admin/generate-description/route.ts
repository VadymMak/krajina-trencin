import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

  const { name, country, flag } = await request.json();

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
          content: 'You are a product description writer for a gourmet food store.',
        },
        {
          role: 'user',
          content: `Write a short appetizing description (2-3 sentences) for: ${name} ${flag} from ${country}. Reply in Slovak language only.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'OpenAI error' }, { status: 502 });
  }

  const data = await res.json();
  const description = data.choices?.[0]?.message?.content?.trim() ?? '';
  return NextResponse.json({ description });
}
