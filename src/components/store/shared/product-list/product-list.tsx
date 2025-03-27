import { FC } from "react";

import { ProductListProps } from "@/components/store/shared/product-list/product-list.types";
import ProductTitle from "@/components/store/shared/product-list/product-title";
import ProductCard from "@/components/store/cards/product/product-card";

import { cn } from "@/lib/utils";

const ProductList: FC<ProductListProps> = ({
  products,
  title,
  link,
  arrow,
}) => {
  return (
    <div className="relative">
      {title && <ProductTitle title={title} link={link} arrow={arrow} />}
      {products.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap -translate-x-5 w-[calc(100%+3rem)] sm:w-[calc(100%+1.5rem)]",
            {
              "mt-2": title,
            }
          )}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProductList;
