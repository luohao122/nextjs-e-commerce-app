import ProductDetails from "@/components/dashboard/forms/product-details/product-details";
import { SellerNewProductVariantPageProps } from "./page.types";
import { getAllCategories } from "@/queries/category.query";

import { CLOUDINARY_PRESET } from "@/config/constants";
import { getProductMainDataById } from "@/queries/product.query";

export default async function SellerNewProductVariantPage({
  params,
}: SellerNewProductVariantPageProps) {
  const storeUrl = (await params).storeUrl;
  const productId = (await params).productId;
  const categories = await getAllCategories();
  const product = await getProductMainDataById(productId);

  if (!product) {
    return null;
  }

  return (
    <div>
      <ProductDetails
        cloudinaryKey={CLOUDINARY_PRESET}
        categories={categories}
        storeUrl={storeUrl}
        data={product}
      />
    </div>
  );
}
