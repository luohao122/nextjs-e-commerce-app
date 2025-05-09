"use client";

import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

import Pagination from "@/components/store/shared/pagination/pagination";
import ProductList from "@/components/store/shared/product-list/product-list";
import { getProductsByIds } from "@/queries/product.query";

export default function HistoryPageContainer({
  page: pageParams,
}: {
  page: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any>([]);
  const [page, setPage] = useState<number>(Number(pageParams) || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch history from localStorage
    const fetchHistory = async () => {
      const historyString = localStorage.getItem("productHistory");
      if (!historyString) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);

        const productHistory = JSON.parse(historyString);
        const page = Number(pageParams);

        // Fetch products by ids
        const res = await getProductsByIds(productHistory, page);
        setProducts(res.products);
        setTotalPages(res.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product history:", error);
        setProducts([]);
        setLoading(false);
      }
    };
    setLoading(false);

    fetchHistory();
  }, [pageParams]);

  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Your product view history</h1>
      {loading ? (
        <PulseLoader />
      ) : products.length > 0 ? (
        <div className="pb-16">
          <ProductList products={products} />
          <div className="mt-2">
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        </div>
      ) : (
        <div>No products</div>
      )}
    </div>
  );
}
