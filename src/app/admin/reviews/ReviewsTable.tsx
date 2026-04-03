'use client';

import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

interface Review {
  id: number;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export default function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const router = useRouter();

  async function approve(id: number) {
    await fetch(`/api/reviews/${id}/approve`, { method: 'POST' });
    router.refresh();
  }

  async function remove(id: number, name: string) {
    if (!confirm(`Vymazať recenziu od "${name}"?`)) return;
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  if (reviews.length === 0) {
    return <div className={styles.empty}>Žiadne recenzie.</div>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Meno</th>
          <th>Text</th>
          <th>Hodnotenie</th>
          <th>Stav</th>
          <th>Akcie</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((r) => (
          <tr key={r.id}>
            <td>
              <div style={{ fontWeight: 500 }}>{r.name}</div>
              {r.role && <div style={{ fontSize: 12, color: '#888' }}>{r.role}</div>}
            </td>
            <td style={{ maxWidth: 320 }}>
              <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {r.text}
              </span>
            </td>
            <td>
              <span className={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            </td>
            <td>
              {r.approved
                ? <span className={styles.badgeGreen}>Schválená</span>
                : <span className={styles.badgeGray}>Čaká</span>}
            </td>
            <td>
              <div className={styles.actions}>
                {!r.approved && (
                  <button
                    className={`${styles.btnIcon} ${styles.btnIconSuccess}`}
                    onClick={() => approve(r.id)}
                    title="Schváliť"
                  >
                    ✅
                  </button>
                )}
                <button
                  className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                  onClick={() => remove(r.id, r.name)}
                  title="Vymazať"
                >
                  ❌
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
