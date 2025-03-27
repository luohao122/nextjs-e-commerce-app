import { getAllCategories } from "@/queries/category.query";
import { SellerNewProductPageProps } from "./page.types";
import ProductDetails from "@/components/dashboard/forms/product-details/product-details";

import { CLOUDINARY_PRESET } from "@/config/constants";

export default async function SellerNewProductPage({
  params,
}: SellerNewProductPageProps) {
  const storeUrl = (await params).storeUrl;
  const categories = await getAllCategories();

  return (
    <div className="w-full">
      <ProductDetails
        storeUrl={storeUrl}
        categories={categories}
        cloudinaryKey={CLOUDINARY_PRESET}
      />
    </div>
  );
}
