'use client';

import { useTranslations } from 'next-intl';
import LeafletMap from '@/components/ui/LeafletMap/LeafletMap';
import styles from './Contact.module.css';

const MAPS_URL = 'https://www.google.com/maps/place/Krajina/@48.8722709,18.0349301';
const MAP_LAT  = 48.8722709;
const MAP_LNG  = 18.0349301;
const MAP_LABEL = 'Krajina, Soblahovská 3161, Trenčín';

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
            <LeafletMap
              lat={MAP_LAT}
              lng={MAP_LNG}
              label={MAP_LABEL}
              height={460}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
