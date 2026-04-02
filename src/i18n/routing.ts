import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['sk', 'cs', 'en', 'uk'],
  defaultLocale: 'sk',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
