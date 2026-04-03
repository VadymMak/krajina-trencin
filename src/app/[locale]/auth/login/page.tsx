'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import styles from './page.module.css';

export default function LoginPage() {
  const t      = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(t('invalidCredentials'));
    } else {
      router.push(`/${locale}`);
      router.refresh();
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <Link href={`/${locale}`} className={styles.logoWrap}>
          <Image
            src="/images/logo.png"
            alt="Krajina"
            width={120}
            height={40}
            className={styles.logo}
            style={{ width: 'auto', height: 40 }}
          />
        </Link>

        <h1 className={styles.title}>{t('login')}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">{t('email')}</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">{t('password')}</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            <span className={styles.btnInner}>
              {loading && (
                <span style={{
                  display: 'inline-block', width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              )}
              {loading ? 'Prihlasovanie…' : t('login')}
            </span>
          </button>
        </form>

        <p className={styles.switchLink}>
          <Link href={`/${locale}/auth/register`}>{t('noAccount')}</Link>
        </p>
      </div>
    </main>
  );
}
