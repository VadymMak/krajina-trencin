'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';
import BasketButton from '@/components/Basket/BasketButton';

const LOCALE_OPTIONS = [
  { code: 'sk', flag: '🇸🇰', label: 'SK' },
  { code: 'cs', flag: '🇨🇿', label: 'CS' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'uk', flag: '🇺🇦', label: 'UK' },
] as const;

const NAV_KEYS = ['home', 'products', 'about', 'blog', 'contact'] as const;

function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2.5 3.75l2.5 2.5 2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t             = useTranslations('nav');
  const tHeader       = useTranslations('header');
  const tAuth         = useTranslations('auth');
  const currentLocale = useLocale();
  const router        = useRouter();
  const pathname      = usePathname();
  const { data: session, status } = useSession();

  const hasHero = pathname === `/${currentLocale}` || pathname === '/';

  function getHref(key: string): string {
    if (key === 'products') return `/${currentLocale}/products`;
    if (key === 'about')    return `#about`;
    if (key === 'blog')     return `#blog`;
    if (key === 'contact')  return `#contact`;
    return `/${currentLocale}`;
  }

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId: number;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      const shouldHide = y > lastScrollY && y > 100;
      document.documentElement.style.setProperty('--header-visible', shouldHide ? '0' : '1');
      lastScrollY = y;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); };
  }, []);

  useEffect(() => {
    const close = () => setLangOpen(false);
    if (langOpen) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [langOpen]);

  useEffect(() => {
    const close = () => setUserOpen(false);
    if (userOpen) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [userOpen]);

  const switchLocale = useCallback((code: string) => {
    setLangOpen(false);
    setMenuOpen(false);
    const segments = pathname.split('/');
    segments[1] = code;
    router.push(segments.join('/') || '/');
  }, [pathname, router]);

  const initials = (
    session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? ''
  ).toUpperCase();

  const isAdmin = session?.user?.role === 'admin';

  return (
    <header
      className={`${styles.header} ${(scrolled || !hasHero) ? styles.headerScrolled : ''}`}
      style={{
        transform: 'translateY(calc((1 - var(--header-visible, 1)) * -100%))',
        transition: 'transform 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div className={styles.inner}>

        {/* Logo */}
        <Link href={`/${currentLocale}`} className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="Krajina"
            height={48}
            width={140}
            className={styles.logoImg}
            style={{ height: 48, width: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          {NAV_KEYS.map((key) => (
            <a key={key} href={getHref(key)} className={styles.navLink}>
              {t(key)}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className={styles.actions}>

          {/* Language switcher */}
          <div className={styles.langWrap} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.langBtn}
              onClick={() => setLangOpen(!langOpen)}
              aria-label={tHeader('lang_switch')}
            >
              <span>{LOCALE_OPTIONS.find(l => l.code === currentLocale)?.flag}</span>
              <span>{currentLocale.toUpperCase()}</span>
              <ChevronIcon />
            </button>
            {langOpen && (
              <div className={styles.langDropdown}>
                {LOCALE_OPTIONS.map(({ code, flag, label }) => (
                  <button
                    key={code}
                    className={`${styles.langOption} ${currentLocale === code ? styles.langOptionActive : ''}`}
                    onClick={() => switchLocale(code)}
                  >
                    {flag} {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Basket */}
          <BasketButton />

          {/* Auth */}
          {status === 'loading' ? null : status === 'unauthenticated' ? (
            <Link href={`/${currentLocale}/auth/login`} className={styles.authLoginBtn}>
              {tAuth('login')}
            </Link>
          ) : (
            <div className={styles.userWrap} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.userBtn}
                onClick={() => setUserOpen(!userOpen)}
                aria-label={tAuth('myAccount')}
              >
                <span className={styles.userAvatar}>{initials}</span>
                {isAdmin && <span className={styles.adminBadge}>Admin</span>}
              </button>
              {userOpen && (
                <div className={styles.userDropdown}>
                  {isAdmin && (
                    <Link
                      href="/admin/products"
                      className={styles.userOption}
                      onClick={() => setUserOpen(false)}
                    >
                      {tAuth('adminPanel')}
                    </Link>
                  )}
                  <Link
                    href={`/${currentLocale}/account`}
                    className={styles.userOption}
                    onClick={() => setUserOpen(false)}
                  >
                    {tAuth('myAccount')}
                  </Link>
                  <button
                    className={`${styles.userOption} ${styles.userOptionLogout}`}
                    onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                  >
                    {tAuth('logout')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <a href="#contact" className={styles.ctaBtn}>
            {t('contact')}
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? tHeader('close_menu') : tHeader('open_menu')}
        >
          {menuOpen ? <CloseIcon /> : <BurgerIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {NAV_KEYS.map((key) => (
              <a
                key={key}
                href={getHref(key)}
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {t(key)}
              </a>
            ))}
            {session && isAdmin && (
              <Link
                href="/admin/products"
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {tAuth('adminPanel')}
              </Link>
            )}
            {session ? (
              <>
                <Link
                  href={`/${currentLocale}/account`}
                  className={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {tAuth('myAccount')}
                </Link>
                <button
                  className={styles.mobileNavLink}
                  style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: `/${currentLocale}` }); }}
                >
                  {tAuth('logout')}
                </button>
              </>
            ) : (
              <Link
                href={`/${currentLocale}/auth/login`}
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {tAuth('login')}
              </Link>
            )}
          </nav>

          <div className={styles.mobileLangs}>
            {LOCALE_OPTIONS.map(({ code, flag, label }) => (
              <button
                key={code}
                className={`${styles.mobileLangPill} ${currentLocale === code ? styles.mobileLangPillActive : ''}`}
                onClick={() => switchLocale(code)}
              >
                {flag} {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
