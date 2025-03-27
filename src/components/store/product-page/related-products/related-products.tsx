import { FC } from "react";

import ProductList from "@/components/store/shared/product-list/product-list";
import { RelatedProductsProps } from "@/components/store/product-page/related-products/related-products.types";

const RelatedProducts: FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="mt-4 space-y-1">
      <ProductList products={products} title="Related products" />
    </div>
  );
};

export default RelatedProducts;
