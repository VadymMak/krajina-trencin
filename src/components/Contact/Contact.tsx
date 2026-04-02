'use client';

import { useTranslations } from 'next-intl';
import styles from './Contact.module.css';

const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2627.5!2d18.0349301!3d48.8722709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4714a3448ba80239%3A0xbf22b704132bc7fd!2sKrajina!5e0!3m2!1ssk!2ssk!4v1';
const MAPS_URL  = 'https://www.google.com/maps/place/Krajina/@48.8722709,18.0349301';

export default function Contact() {
  const t = useTranslations('contact');

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>

        {/* Left column */}
        <div className={styles.left}>

          {/* Header */}
          <p className={styles.label}>{t('label')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>

          {/* Cards */}
          <div className={styles.cards}>

            {/* Address */}
            <div className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true">📍</span>
              <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{t('card_address')}</p>
                <p className={styles.cardText}>
                  Soblahovská 3161<br />
                  911 01 Trenčín<br />
                  Slovenská republika
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true">📞</span>
              <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{t('card_contact')}</p>
                <p className={styles.cardText}>
                  <a href="tel:+421918338932" className={styles.cardLink}>0918 338 932</a><br />
                  <a href="mailto:info@krajina.eu" className={styles.cardLink}>info@krajina.eu</a>
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true">🕐</span>
              <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{t('card_hours')}</p>
                <p className={styles.cardText} style={{ whiteSpace: 'pre-line' }}>
                  {t('hours_body')}
                </p>
              </div>
            </div>

          </div>

          {/* CTA Maps */}
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            {t('cta_maps')}
          </a>
        </div>

        {/* Right column — map */}
        <div className={styles.right}>
          <span className={styles.deliveryBadge}>{t('delivery')}</span>
          <div className={styles.mapWrap}>
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="100%"
              style={{ border: 'none', borderRadius: 'var(--radius-lg)', minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Krajina na mape"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
