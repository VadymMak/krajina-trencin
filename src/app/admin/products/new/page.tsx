import ProductForm from '../ProductForm';
import styles from '../../admin.module.css';

export default function AdminNewProductPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Nový produkt</h1>
      </div>
      <ProductForm mode="new" />
    </>
  );
}
