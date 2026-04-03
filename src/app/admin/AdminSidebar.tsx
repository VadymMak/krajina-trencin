'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';
import { useAdminTranslations } from './i18n/useAdminTranslations';
import type { AdminLocale } from './i18n/translations';

const LOCALES: { value: AdminLocale; label: string }[] = [
  { value: 'sk', label: 'SK' },
  { value: 'cs', label: 'CS' },
  { value: 'en', label: 'EN' },
  { value: 'uk', label: 'UK' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { t, locale, changeLocale } = useAdminTranslations();

  const NAV = [
    { href: '/admin/products', icon: '📦', label: t.products },
    { href: '/admin/orders',   icon: '🛒', label: t.orders   },
    { href: '/admin/reviews',  icon: '⭐', label: t.reviews  },
  ];

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoTitle}>Krajina</div>
        <div className={styles.logoSub}>{t.adminPanel}</div>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${pathname.startsWith(href) ? styles.navLinkActive : ''}`}
          >
            <span className={styles.navIcon}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <button className={styles.logoutBtn} onClick={logout}>
        <span className={styles.navIcon}>🚪</span>
        {t.logout}
      </button>

      <div className={styles.localeSwitcher}>
        {LOCALES.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.localeBtn} ${locale === value ? styles.localeBtnActive : ''}`}
            onClick={() => changeLocale(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
