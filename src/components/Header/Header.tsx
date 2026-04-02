'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

const LOCALE_OPTIONS = [
  { code: 'sk', flag: '🇸🇰', label: 'SK' },
  { code: 'cs', flag: '🇨🇿', label: 'CS' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'uk', flag: '🇺🇦', label: 'UK' },
] as const;

const NAV_KEYS = ['home', 'categories', 'products', 'about', 'contact'] as const;

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

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 7h12M7 1c1.7 1.7 2.7 3.7 2.7 6s-1 4.3-2.7 6c-1.7-1.7-2.7-3.7-2.7-6s1-4.3 2.7-6z" stroke="currentColor" strokeWidth="1" />
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
  const [scrolled, setScrolled] = useState(false);
  const t             = useTranslations('nav');
  const tHeader       = useTranslations('header');
  const currentLocale = useLocale();
  const router        = useRouter();
  const pathname      = usePathname();

  function getHref(key: string): string {
    if (key === 'categories') return `#categories`;
    if (key === 'products')   return `/${currentLocale}/products`;
    if (key === 'about')      return `#about`;
    if (key === 'contact')    return `#contact`;
    return `/${currentLocale}`;
  }

  // Единый RAF-хандлер: hide/show по направлению + transparent→solid по порогу
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId: number;

    const update = () => {
      const y = window.scrollY;

      // transparent → solid при scrollY > 80
      setScrolled(y > 80);

      // hide/show по направлению скролла (adriano паттерн)
      const shouldHide = y > lastScrollY && y > 100;
      document.documentElement.style.setProperty(
        '--header-visible',
        shouldHide ? '0' : '1'
      );

      lastScrollY = y;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    // Инициализация при монтировании
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const close = () => setLangOpen(false);
    if (langOpen) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [langOpen]);

  const switchLocale = useCallback((code: string) => {
    setLangOpen(false);
    setMenuOpen(false);
    const segments = pathname.split('/');
    segments[1] = code;
    router.push(segments.join('/') || '/');
  }, [pathname, router]);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
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
