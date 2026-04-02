'use client';

import { useTranslations } from 'next-intl';
import styles from './Testimonials.module.css';

const REVIEWS = [
  {
    textKey:   'r1_text',
    roleKey:   'r1_role',
    name:      'Nam Anh',
    initials:  'NA',
    avatarVar: 'var(--color-green)',
  },
  {
    textKey:   'r2_text',
    roleKey:   'r2_role',
    name:      'Roman',
    initials:  'R',
    avatarVar: 'var(--color-accent)',
  },
  {
    textKey:   'r3_text',
    roleKey:   'r3_role',
    name:      'Lucka',
    initials:  'L',
    avatarVar: 'var(--color-green-dark)',
  },
] as const;

export default function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.label}>{t('label')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
          <div className={styles.divider} />
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {REVIEWS.map(({ textKey, roleKey, name, initials, avatarVar }) => (
            <div key={name} className={styles.card}>
              {/* Stars */}
              <div className={styles.stars} aria-label="5 stars">
                {'★★★★★'}
              </div>

              {/* Quote */}
              <p className={styles.quote}>{t(textKey)}</p>

              {/* Author */}
              <div className={styles.author}>
                <div
                  className={styles.avatar}
                  style={{ background: avatarVar }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.role}>{t(roleKey)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
