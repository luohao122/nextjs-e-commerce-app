import ProductList from "@/components/store/shared/product-list/product-list";
import { getProducts } from "@/queries/product.query";

export default async function Home() {
  const { products } = await getProducts();

  return (
    <div className="p-14">
      <ProductList products={products} title="Products" arrow />
    </div>
  );
}
