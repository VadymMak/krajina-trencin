'use client';

import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';
import { useAdminTranslations } from '../i18n/useAdminTranslations';

interface Review {
  id: number;
  name: string;
  role: string | null;
  text: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

interface Props {
  reviews: Review[];
  count: number;
}

export default function ReviewsTable({ reviews, count }: Props) {
  const router = useRouter();
  const { t }  = useAdminTranslations();

  async function approve(id: number) {
    await fetch(`/api/reviews/${id}/approve`, { method: 'POST' });
    router.refresh();
  }

  async function remove(id: number, name: string) {
    if (!confirm(`${t.delete} "${name}"?`)) return;
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t.reviews} ({count})</h1>
      </div>

      <div className={styles.card}>
        {reviews.length === 0 ? (
          <div className={styles.empty}>{t.noReviews}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t.reviewer}</th>
                <th>{t.review}</th>
                <th>{t.rating}</th>
                <th>{t.status}</th>
                <th>{t.actions}</th>
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
                      ? <span className={styles.badgeGreen}>{t.approved}</span>
                      : <span className={styles.badgeGray}>{t.pending}</span>}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {!r.approved && (
                        <button
                          className={`${styles.btnIcon} ${styles.btnIconSuccess}`}
                          onClick={() => approve(r.id)}
                          title={t.approve}
                        >
                          ✅
                        </button>
                      )}
                      <button
                        className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                        onClick={() => remove(r.id, r.name)}
                        title={t.delete}
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
