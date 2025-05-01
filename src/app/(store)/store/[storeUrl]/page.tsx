import ProductFilters from "@/components/store/browse-page/product-filters/product-filters";
import ProductSort from "@/components/store/browse-page/sort";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";

import Header from "@/components/store/layout/header/header";
import StoreDetails from "@/components/store/store-page/store-details";
import StoreProducts from "@/components/store/store-page/store-products";

import { SearchParamsType } from "@/types/types";
import { getStorePageDetails } from "@/queries/store.query";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ storeUrl: string }>;
  searchParams: SearchParamsType;
}) {
  const storeUrl = (await params).storeUrl;
  const queries = await searchParams;
  const store = await getStorePageDetails(storeUrl);

  return (
    <>
      <Header />
      <CategoriesHeader />
      <StoreDetails details={store} />
      <div className="max-w-[95%] mx-auto border-t">
        <div className="flex mt-5 gap-x-5">
          <ProductFilters queries={searchParams} storeUrl={storeUrl} />
          <div className="p-4 space-y-5">
            <ProductSort />
            <StoreProducts searchParams={queries} store={storeUrl} />
          </div>
        </div>
      </div>
    </>
  );
}
