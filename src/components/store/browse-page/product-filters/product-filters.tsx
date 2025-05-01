import { FC } from "react";

import { ProductFiltersProps } from "@/components/store/browse-page/product-filters/product-filters.types";
import { getAllCategories } from "@/queries/category.query";
import { getAllOfferTags } from "@/queries/offer-tag.query";

import FiltersHeader from "@/components/store/browse-page/filters/filters-header/filters-header";
import CategoriesFilters from "@/components/store/browse-page/filters/category-filters/categories-filters";
import OfferFilter from "@/components/store/browse-page/filters/offer-filter/offer-filter";

import SizeFilter from "@/components/store/browse-page/filters/size-filter/size-filter";

const ProductFilters: FC<ProductFiltersProps> = async ({
  queries,
  storeUrl,
}) => {
  const searchParams = await queries;
  const categories = await getAllCategories(storeUrl);
  const offers = await getAllOfferTags(storeUrl);

  return (
    <div className="h-[840px] transition-transform overflow-auto pr-6 pb-2.5 flex-none basis-[196px] sticky top-0 overflow-x-hidden scrollbar">
      <FiltersHeader queries={searchParams} />
      {/* Filters */}
      <div className="border-t w-44">
        <CategoriesFilters categories={categories} />
        <OfferFilter offers={offers} />
        <SizeFilter queries={searchParams} storeUrl={storeUrl} />
      </div>
    </div>
  );
};

export default ProductFilters;
