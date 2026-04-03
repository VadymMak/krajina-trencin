'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';

const NAV = [
  { href: '/admin/products', icon: '📦', label: 'Produkty' },
  { href: '/admin/orders',   icon: '🛒', label: 'Objednávky' },
  { href: '/admin/reviews',  icon: '⭐', label: 'Recenzie' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoTitle}>Krajina</div>
        <div className={styles.logoSub}>Admin panel</div>
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
        Odhlásiť sa
      </button>
    </aside>
  );
}
