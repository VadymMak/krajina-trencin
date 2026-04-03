'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const t      = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8)         { setError(t('passwordShort'));    return; }
    if (password !== confirm)         { setError(t('passwordMismatch')); return; }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(res.status === 409 ? t('emailInUse') : (data.error ?? 'Error'));
    } else {
      router.push(`/${locale}/auth/login?registered=1`);
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

        <h1 className={styles.title}>{t('register')}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">{t('name')}</label>
            <input
              id="name"
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm">{t('confirmPassword')}</label>
            <input
              id="confirm"
              className={styles.input}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? '…' : t('register')}
          </button>
        </form>

        <p className={styles.switchLink}>
          <Link href={`/${locale}/auth/login`}>{t('hasAccount')}</Link>
        </p>
      </div>
    </main>
  );
}
