'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './Instagram.module.css';

const INSTAGRAM_URL = 'https://www.instagram.com/krajina.eu';

const PHOTOS = [
  { src: '/images/about/shop-01.jpg', alt: 'Krajina store 1' },
  { src: '/images/about/shop-02.jpg', alt: 'Krajina store 2' },
  { src: '/images/about/shop-03.jpg', alt: 'Krajina store 3' },
  { src: '/images/about/shop-04.jpg', alt: 'Krajina store 4' },
  { src: '/images/about/shop-01.jpg', alt: 'Krajina store 5' },
  { src: '/images/about/shop-02.jpg', alt: 'Krajina store 6' },
];

function InstagramIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function Instagram() {
  const t = useTranslations('instagram');

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header — entire header is a link */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.header}
        >
          <span className={styles.iconWrap}>
            <InstagramIcon />
          </span>
          <span className={styles.handle}>@krajina.eu</span>
          <span className={styles.subtitle}>{t('subtitle')}</span>
        </a>

        {/* Photo grid */}
        <div className={styles.grid}>
          {PHOTOS.map(({ src, alt }, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cell}
              aria-label={alt}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className={styles.photo}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
              />
              <div className={styles.overlay} />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.ctaWrap}>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            {t('cta')}
          </a>
        </div>

      </div>
    </section>
  );
}
