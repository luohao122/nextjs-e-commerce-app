/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProductList from "@/components/store/shared/product-list/product-list";
import Pagination from "@/components/store/shared/pagination/pagination";
import { WishlistContainerProps } from "@/components/store/profile/wishlist/wishlist-container.types";

export default function WishlistContainer({
  products,
  page,
  totalPages,
}: WishlistContainerProps) {
  const router = useRouter();
  const [currentPage, setPage] = useState<number>(page);

  useEffect(() => {
    if (currentPage !== page) {
      router.push(`/profile/wishlist/${currentPage}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, page]);

  return (
    <div>
      <div className="flex flex-wrap pb-16">
        <ProductList products={products as any} />
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}
