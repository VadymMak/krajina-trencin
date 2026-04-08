'use client';

import { useAdminTranslations } from '../i18n/useAdminTranslations';
import styles from '../admin.module.css';
import orderStyles from './orders.module.css';

interface OrderItem {
  id:       number;
  quantity: number;
  price:    number;
  product:  { name: string };
}

interface Order {
  id:           number;
  email:        string;
  total:        number;
  status:       string;
  createdAt:    string;
  customerName: string | null;
  phone:        string | null;
  address:      string | null;
  city:         string | null;
  zip:          string | null;
  items:        OrderItem[];
}

interface Props {
  orders: Order[];
}

export default function OrdersTable({ orders }: Props) {
  const { t } = useAdminTranslations();

  const statusLabel = (status: string) => {
    if (status === 'paid')      return t.paid;
    if (status === 'cancelled') return t.cancelled;
    return t.pending;
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t.orders}</h1>
      </div>

      <div className={styles.card}>
        {orders.length === 0 ? (
          <div className={styles.empty}>{t.noOrders}</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.orderId}</th>
                  <th>{t.customer}</th>
                  <th>{t.email}</th>
                  <th>{t.phone}</th>
                  <th>{t.address}</th>
                  <th>{t.total}</th>
                  <th>{t.status}</th>
                  <th>{t.items}</th>
                  <th>{t.date}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerName ?? '—'}</td>
                    <td>{order.email}</td>
                    <td>{order.phone ?? '—'}</td>
                    <td>
                      {order.address
                        ? [order.address, order.zip, order.city].filter(Boolean).join(', ')
                        : '—'}
                    </td>
                    <td>{order.total.toFixed(2).replace('.', ',')} €</td>
                    <td>
                      <span className={`${orderStyles.badge} ${orderStyles[order.status] ?? orderStyles.pending}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      {order.items.length > 0
                        ? order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')
                        : '—'}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
