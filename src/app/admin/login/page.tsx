'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

export default function AdminLoginPage() {
  const router   = useRouter();
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });

    if (res.ok) {
      router.push('/admin/products');
    } else {
      setError('Nesprávne heslo');
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginTitle}>Krajina Admin</div>
        <div className={styles.loginSub}>Prihláste sa do administrácie</div>

        <form onSubmit={onSubmit}>
          {error && <p className={styles.loginError}>{error}</p>}
          <input
            className={styles.loginInput}
            type="password"
            placeholder="Heslo"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            required
          />
          <button className={styles.loginBtn} type="submit" disabled={loading}>
            <span className={styles.loginBtnInner}>
              {loading && (
                <span style={{
                  display: 'inline-block', width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              )}
              {loading ? 'Prihlasovanie…' : 'Prihlásiť sa'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
