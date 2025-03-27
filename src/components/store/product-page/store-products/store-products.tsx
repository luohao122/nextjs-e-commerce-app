"use client";

import { FC, useCallback, useEffect, useState } from "react";

import { ProductType } from "@/components/store/shared/product-list/product-list.types";
import { getProducts } from "@/queries/product.query";
import ProductList from "@/components/store/shared/product-list/product-list";

import { useToast } from "@/hooks/use-toast";
import { StoreProductsProps } from "@/components/store/product-page/store-products/store-products.types";

const StoreProducts: FC<StoreProductsProps> = ({
  storeName,
  storeUrl,
  count,
}) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const { toast } = useToast();

  const getStoreProducts = useCallback(async () => {
    try {
      const res = await getProducts({ store: storeUrl }, "", 1, count);
      setProducts(res.products);
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to get store's products" });
    }
  }, [count, storeUrl, toast]);

  useEffect(() => {
    getStoreProducts();
  }, [getStoreProducts]);

  return (
    <div className="relative mt-6">
      <ProductList
        products={products}
        title={`Recommended from ${storeName}`}
        arrow
      />
    </div>
  );
};

export default StoreProducts;
