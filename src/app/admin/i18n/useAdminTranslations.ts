'use client';

import { useState, useEffect } from 'react';
import { adminTranslations, type AdminLocale } from './translations';

const LOCALES: AdminLocale[] = ['sk', 'cs', 'en', 'uk'];
const STORAGE_KEY = 'admin_locale';
const EVENT_NAME  = 'admin-locale-change';

export function useAdminTranslations() {
  const [locale, setLocale] = useState<AdminLocale>('sk');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as AdminLocale | null;
    if (saved && LOCALES.includes(saved)) setLocale(saved);

    const handler = (e: Event) => {
      const next = (e as CustomEvent<AdminLocale>).detail;
      if (LOCALES.includes(next)) setLocale(next);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  function changeLocale(next: AdminLocale) {
    setLocale(next);
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent<AdminLocale>(EVENT_NAME, { detail: next }));
  }

  return { t: adminTranslations[locale], locale, changeLocale };
}
