import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { signOut } from '@/lib/auth';
import styles from './page.module.css';

type Params = Promise<{ locale: string }>;

export default async function AccountPage({ params }: { params: Params }) {
  const { locale } = await params;
  const session    = await auth();
  const t          = await getTranslations('auth');

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {t('welcomeBack')} {session.user.name ?? session.user.email}
        </h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('orders')}</h2>
          <p className={styles.empty}>{t('ordersEmpty')}</p>
        </section>

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: `/${locale}` });
          }}
        >
          <button type="submit" className={styles.logoutBtn}>
            {t('logout')}
          </button>
        </form>
      </div>
    </main>
  );
}
