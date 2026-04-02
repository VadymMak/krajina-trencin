'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import styles from './HeroSection.module.css';

const COUNTRIES = [
  { id: 'taliansko',  flag: '🇮🇹', label: 'Taliansko' },
  { id: 'azia',       flag: '🌏', label: 'Ázia' },
  { id: 'francuzsko', flag: '🇫🇷', label: 'Francúzsko' },
  { id: 'grecko',     flag: '🇬🇷', label: 'Grécko' },
  { id: 'spanielsko', flag: '🇪🇸', label: 'Španielsko' },
  { id: 'ukrajina',   flag: '🇺🇦', label: 'Ukrajina' },
] as const;

type CountryId = (typeof COUNTRIES)[number]['id'];

const PRODUCTS: Record<CountryId, { name: string; price: string }[]> = {
  taliansko: [
    { name: 'San Marzano paradajky',  price: '3,90 €' },
    { name: 'Parmigiano Reggiano',    price: '12,50 €' },
    { name: 'Prosciutto di Parma',    price: '18,00 €' },
    { name: 'Pasta di Gragnano',      price: '4,20 €' },
  ],
  azia: [
    { name: 'Japonská sójová omáčka', price: '5,50 €' },
    { name: 'Thajská curry pasta',    price: '4,90 €' },
    { name: 'Kokosové mlieko',        price: '2,80 €' },
    { name: 'Ryžové rezance',         price: '3,20 €' },
  ],
  francuzsko: [
    { name: 'Dijonská horčica',       price: '4,50 €' },
    { name: 'Herbes de Provence',     price: '5,90 €' },
    { name: 'Crème de marrons',       price: '7,20 €' },
    { name: 'Cassoulet',              price: '8,90 €' },
  ],
  grecko: [
    { name: 'Kalamata olivy',         price: '6,50 €' },
    { name: 'Feta DOP',               price: '9,90 €' },
    { name: 'Grécky med',             price: '11,00 €' },
    { name: 'Tzatziki omáčka',        price: '3,80 €' },
  ],
  spanielsko: [
    { name: 'Manchego syr',           price: '13,50 €' },
    { name: 'Chorizo Ibérico',        price: '15,00 €' },
    { name: 'Jamón Serrano',          price: '22,00 €' },
    { name: 'Smoked paprika',         price: '4,20 €' },
  ],
  ukrajina: [
    { name: 'Slnečnicová halva',      price: '5,90 €' },
    { name: 'Pohánkový med',          price: '8,50 €' },
    { name: 'Salo tradičné',          price: '7,80 €' },
    { name: 'Hrečaná kaša',           price: '3,20 €' },
  ],
};

const AUTO_ROTATE_INTERVAL = 4000;
const PAUSE_AFTER_CLICK    = 12000;

export default function HeroSection() {
  const t = useTranslations('hero');

  const [active, setActive]           = useState<CountryId>('taliansko');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const rotateNext = useCallback(() => {
    setActive((current) => {
      const idx = COUNTRIES.findIndex((c) => c.id === current);
      return COUNTRIES[(idx + 1) % COUNTRIES.length].id;
    });
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(rotateNext, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [isAutoPlaying, rotateNext]);

  const handleCountryClick = useCallback((id: CountryId) => {
    setActive(id);
    setIsAutoPlaying(false);
    const resume = setTimeout(() => setIsAutoPlaying(true), PAUSE_AFTER_CLICK);
    return () => clearTimeout(resume);
  }, []);

  const activeCountry = COUNTRIES.find((c) => c.id === active)!;

  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: "url('/images/hero-bg.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={styles.overlay} />

      {/* ─── Левая колонка ─── */}
      <div className={styles.left}>
        <span className={styles.tag}>{t('tag')}</span>

        <h1 className={styles.title}>{t('title')}</h1>

        <p className={styles.subtitle}>{t('subtitle')}</p>

        <div className={styles.divider} />

        <div className={styles.buttons}>
          <a href="#products" className={styles.btnPrimary}>
            {t('cta_primary')}
          </a>
          <a href="#contact" className={styles.btnOutline}>
            {t('cta_secondary')}
          </a>
        </div>
      </div>

      {/* ─── Правая колонка ─── */}
      <div className={styles.right}>

        {/* Переключатель стран */}
        <div className={styles.countries}>
          {COUNTRIES.map((country) => (
            <button
              key={country.id}
              className={`${styles.countryPill} ${active === country.id ? styles.countryPillActive : ''}`}
              onClick={() => handleCountryClick(country.id)}
            >
              <span className={styles.flag}>{country.flag}</span>
              <span>{country.label}</span>
            </button>
          ))}
        </div>

        {/* Progress dots — только при autoplay */}
        {isAutoPlaying && (
          <div className={styles.dots}>
            {COUNTRIES.map((country) => (
              <div
                key={country.id}
                className={`${styles.dot} ${active === country.id ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        )}

        {/* Карточки — key={active} = re-mount = перезапуск CSS-анимации */}
        <div key={active} className={styles.cards}>
          {PRODUCTS[active].map((item) => (
            <div key={item.name} className={styles.card}>
              <div className={styles.cardImage} aria-hidden="true" />
              <div className={styles.cardBody}>
                <span className={styles.cardCountry}>
                  {activeCountry.flag} {activeCountry.label}
                </span>
                <span className={styles.cardName}>{item.name}</span>
              </div>
              <span className={styles.cardPrice}>{item.price}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
