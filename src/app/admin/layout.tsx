import type { Metadata } from 'next';
import AdminSidebar from './AdminSidebar';
import styles from './admin.module.css';

export const metadata: Metadata = { title: 'Admin | Krajina' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>
        <div className={styles.shell}>
          <AdminSidebar />
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
