import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

interface MetadataItem {
  id:       number;
  quantity: number;
  price:    number;
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 });
  }

  const sig    = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerName = session.metadata?.customerName ?? '';
    const phone        = session.metadata?.phone        ?? '';
    const address      = session.metadata?.address      ?? '';
    const city         = session.metadata?.city         ?? '';
    const zip          = session.metadata?.zip          ?? '';
    const items: MetadataItem[] = JSON.parse(session.metadata?.items ?? '[]');

    try {
      await prisma.order.create({
        data: {
          email:        session.customer_email ?? '',
          total:        (session.amount_total ?? 0) / 100,
          status:       'paid',
          stripeId:     session.id,
          customerName,
          phone,
          address,
          city,
          zip,
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity:  item.quantity,
              price:     item.price,
            })),
          },
        },
      });
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  }

  return NextResponse.json({ received: true });
}
