import { getAllCategories } from "@/queries/category.query";
import { getAllOfferTags } from "@/queries/offer-tag.query";
import CategoriesHeaderContainer from "@/components/store/layout/categories-header/categories-header-container/categories-header-container";

export default async function CategoriesHeader() {
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();

  return (
    <div className="w-full pt-2 pb-3 px-0 bg-gradient-to-r from-cyan-950 to-cyan-950">
      <CategoriesHeaderContainer
        categories={categories}
        offerTags={offerTags}
      />
    </div>
  );
}
