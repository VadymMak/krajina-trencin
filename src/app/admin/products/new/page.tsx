import ProductForm from '../ProductForm';
import { ProductFormTitle } from '../ProductFormTitle';

export default function AdminNewProductPage() {
  return (
    <>
      <ProductFormTitle mode="new" />
      <ProductForm mode="new" />
    </>
  );
}
