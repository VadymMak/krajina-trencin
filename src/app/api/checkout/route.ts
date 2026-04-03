import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

interface CheckoutItem {
  id:       number;
  name:     string;
  price:    number;
  quantity: number;
  image:    string | null;
}

interface CustomerInfo {
  name:    string;
  email:   string;
  phone:   string;
  address: string;
  city:    string;
  zip:     string;
}

const DELIVERY_THRESHOLD = 60;
const DELIVERY_PRICE_EUR = 3.99;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_PAYMENTS !== 'true') {
    return NextResponse.json({ error: 'Payments disabled' }, { status: 403 });
  }

  const body: { items: CheckoutItem[]; customerInfo: CustomerInfo; locale?: string } = await req.json();
  const { items, customerInfo, locale = 'sk' } = body;

  if (!items?.length) {
    return NextResponse.json({ error: 'No items' }, { status: 400 });
  }

  const subtotal     = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const freeShipping = subtotal >= DELIVERY_THRESHOLD;

  const shippingRateData = {
    type:         'fixed_amount' as const,
    display_name: freeShipping ? 'Doprava zadarmo' : 'Štandardná doprava',
    fixed_amount: {
      amount:   freeShipping ? 0 : Math.round(DELIVERY_PRICE_EUR * 100),
      currency: 'eur',
    },
  };

  const session = await stripe.checkout.sessions.create({
    mode:           'payment',
    customer_email: customerInfo.email,
    line_items:     items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency:     'eur',
        unit_amount:  Math.round(item.price * 100),
        product_data: {
          name:   item.name,
          images: item.image ? [item.image] : [],
        },
      },
    })),
    shipping_options: [{ shipping_rate_data: shippingRateData }],
    metadata: {
      customerName: customerInfo.name,
      phone:        customerInfo.phone,
      address:      `${customerInfo.address}, ${customerInfo.zip} ${customerInfo.city}`,
    },
    success_url: `${SITE_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${SITE_URL}/${locale}/checkout/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
