'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { useAdminTranslations } from '../i18n/useAdminTranslations';

export default function AdminLoginPage() {
  const { t } = useAdminTranslations();
  const [pw,      setPw]      = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: pw }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = '/admin/products';
      } else {
        setError(t.wrongPassword);
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t.wrongPassword);
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginTitle}>{t.adminTitle}</div>
        <div className={styles.loginSub}>{t.loginSubtitle}</div>

        <form onSubmit={onSubmit}>
          {error && <p className={styles.loginError}>{error}</p>}
          <input
            className={styles.loginInput}
            type="password"
            placeholder={t.password}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            required
          />
          <button className={styles.loginBtn} type="submit" disabled={loading}>
            <span className={styles.loginBtnInner}>
              {loading && (
                <span className={styles.loginSpinner} aria-hidden="true" />
              )}
              {loading ? t.loggingIn : t.loginBtn}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
