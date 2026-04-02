'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './About.module.css';

const PHOTOS = [
  { src: '/images/about/shop-01.jpg', alt: 'Krajina shop 1' },
  { src: '/images/about/shop-02.jpg', alt: 'Krajina shop 2' },
  { src: '/images/about/shop-03.jpg', alt: 'Krajina shop 3' },
  { src: '/images/about/shop-04.jpg', alt: 'Krajina shop 4' },
];

const VALUE_CARDS = [
  { icon: '🌍', titleKey: 'card1_title', textKey: 'card1_text' },
  { icon: '⚡', titleKey: 'card2_title', textKey: 'card2_text' },
  { icon: '🏪', titleKey: 'card3_title', textKey: 'card3_text' },
] as const;

export default function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>

        {/* Left column */}
        <div className={styles.left}>
          <p className={styles.label}>{t('label')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
          <p className={styles.body}>{t('body')}</p>

          <div className={styles.cards}>
            {VALUE_CARDS.map(({ icon, titleKey, textKey }) => (
              <div key={titleKey} className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true">{icon}</span>
                <span className={styles.cardTitle}>{t(titleKey)}</span>
                <span className={styles.cardText}>{t(textKey)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — photo grid */}
        <div className={styles.right}>
          <div className={styles.photoGrid}>
            {PHOTOS.map(({ src, alt }, i) => (
              <div key={src} className={`${styles.photoWrap} ${i === 0 ? styles.photoTall : ''}`}>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={styles.photo}
                  sizes="(max-width: 768px) 50vw, 22vw"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
