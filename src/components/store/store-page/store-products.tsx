"use client";

import { useEffect, useState } from "react";

import { FiltersQueryType } from "@/types/types";
import { ProductType } from "@/types/product.types";
import { getProducts } from "@/queries/product.query";

import ProductCard from "@/components/store/cards/product/product-card";

export default function StoreProducts({
  searchParams,
  store,
}: {
  searchParams: FiltersQueryType;
  store: string;
}) {
  const [data, setData] = useState<ProductType[]>([]);
  const {
    category,
    offer,
    search,
    size,
    sort,
    subCategory,
    minPrice,
    maxPrice,
  } = searchParams;

  useEffect(() => {
    const getFilteredProducts = async () => {
      const { products } = await getProducts(
        {
          category,
          offer,
          search,
          minPrice: Number(minPrice) || 0, // Default to 0 if minPrice is not provided
          maxPrice: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
          size: Array.isArray(size) ? size : size ? [size] : undefined,
          subCategory,
          store,
        },
        sort,
        1,
        100
      );
      setData(products);
    };
    getFilteredProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className=" bg-white justify-center md:justify-start flex flex-wrap p-2 pb-16 rounded-md">
      {data.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
