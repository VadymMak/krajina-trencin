import Image from 'next/image';
import styles from './Footer.module.css';

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9l6 3-6 3V9z" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Domov',     href: '/' },
  { label: 'Predajňa',  href: '#categories' },
  { label: 'Obchod',    href: '/products' },
  { label: 'O nás',     href: '#about' },
  { label: 'Blog',      href: '#blog' },
  { label: 'Kontakt',   href: '#contact' },
];

const CATEGORIES = [
  { flag: '🇮🇹', label: 'Taliansko' },
  { flag: '🌏',  label: 'Ázia' },
  { flag: '🇫🇷', label: 'Francúzsko' },
  { flag: '🇬🇷', label: 'Grécko' },
  { flag: '🇪🇸', label: 'Španielsko' },
  { flag: '🇺🇦', label: 'Ukrajina' },
];

const LEGAL_LINKS = [
  { label: 'Ochrana súkromia', href: '#' },
  { label: 'Obchodné podmienky', href: '#' },
  { label: 'Cookies', href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>

          {/* Колонка 1 — Бренд */}
          <div className={styles.col}>
            <a href="/" className={styles.brandLogo}>
              <Image
                src="/images/logo.png"
                alt="Krajina"
                height={40}
                width={120}
                className={styles.brandLogoImg}
                style={{ height: 40, width: 'auto' }}
              />
            </a>
            <p className={styles.brandDesc}>
              Krajina znamená zem — prinášame vám chute sveta
            </p>
            <div className={styles.socials}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className={styles.socialLink} aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className={styles.socialLink} aria-label="YouTube">
                <YoutubeIcon />
              </a>
              <a href="https://instagram.com/krajina.eu" target="_blank" rel="noopener noreferrer"
                className={styles.socialLink} aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="mailto:info@krajina.eu"
                className={styles.socialLink} aria-label="Email">
                <MailIcon />
              </a>
            </div>
          </div>

          {/* Колонка 2 — Навигация */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Hlavné menu</h4>
            <nav className={styles.navList}>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} className={styles.navLink}>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Колонка 3 — Категории */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Kategórie</h4>
            <nav className={styles.navList}>
              {CATEGORIES.map(({ flag, label }) => (
                <a key={label} href="/products" className={styles.navLink}>
                  <span className={styles.catFlag}>{flag}</span>
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Колонка 4 — Контакт */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Kontakt</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}><LocationIcon /></span>
                <span>Soblahovská 3161<br />911 01 Trenčín<br />Slovenská republika</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}><PhoneIcon /></span>
                <a href="tel:+421918338932" className={styles.contactLink}>0918 338 932</a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}><MailIcon /></span>
                <a href="mailto:info@krajina.eu" className={styles.contactLink}>info@krajina.eu</a>
              </li>
            </ul>
            <span className={styles.deliveryBadge}>
              Doprava zadarmo nad 60 €
            </span>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <div className={styles.bottomBar}>
            <span className={styles.copyright}>
              © {year} Krajina. Všetky práva vyhradené.
            </span>
            <nav className={styles.legalLinks}>
              {LEGAL_LINKS.map(({ label, href }, i) => (
                <span key={label} className={styles.legalGroup}>
                  {i > 0 && <span className={styles.legalSep}>·</span>}
                  <a href={href} className={styles.legalLink}>{label}</a>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
