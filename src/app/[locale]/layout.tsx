import type { Metadata } from 'next';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BasketDrawer from '@/components/Basket/BasketDrawer';
import { BasketProvider } from '@/context/BasketContext';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import '../../styles/globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://krajina.eu';
const LOCALES  = routing.locales;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const canonicalUrl = `${BASE_URL}/${locale}`;

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE_URL}/${l}`])
      ),
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      siteName: 'Krajina — Medzinárodný obchod',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;
  const session  = await auth();

  return (
    <html lang={locale} className={`${playfair.variable} ${sourceSans.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider session={session}>
            <BasketProvider>
              <Header />
              {children}
              <Footer />
              <BasketDrawer />
            </BasketProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
