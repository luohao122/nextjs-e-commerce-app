import { getAllCategories } from "@/queries/category.query";
import { SellerNewProductPageProps } from "./page.types";
import ProductDetails from "@/components/dashboard/forms/product-details/product-details";

import { CLOUDINARY_PRESET } from "@/config/constants";
import { getAllOfferTags } from "@/queries/offer-tag.query";
import { getCountryList } from "@/queries/country.query";

export default async function SellerNewProductPage({
  params,
}: SellerNewProductPageProps) {
  const storeUrl = (await params).storeUrl;
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  const countries = await getCountryList()

  return (
    <div className="w-full">
      <ProductDetails
        storeUrl={storeUrl}
        categories={categories}
        cloudinaryKey={CLOUDINARY_PRESET}
        offerTags={offerTags}
        countries={countries}
      />
    </div>
  );
}
