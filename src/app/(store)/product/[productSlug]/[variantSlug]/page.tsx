import { notFound, redirect } from "next/navigation";

import { getProductPageData, getProducts } from "@/queries/product.query";
import { ProductVariantPageProps } from "./page.types";
import { Separator } from "@/components/ui/separator";

import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";
import ProductPageContainer from "@/components/store/product-page/product-page-container/product-page-container";
import RelatedProducts from "@/components/store/product-page/related-products/related-products";

import ProductDescription from "@/components/store/product-page/product-description/product-description";
import ProductSpecs from "@/components/store/product-page/product-specs/product-specs";
import ProductQuestions from "@/components/store/product-page/product-questions/product-questions";

import Header from "@/components/store/layout/header/header";
import StoreCard from "@/components/store/cards/store-card/store-card";
import StoreProducts from "@/components/store/product-page/store-products/store-products";

import ProductReviews from "@/components/store/product-page/reviews/product-reviews";

export default async function ProductVariantPage({
  params,
  searchParams,
}: ProductVariantPageProps) {
  const { productSlug, variantSlug } = await params;
  const { size: sizeId } = await searchParams;
  const product = await getProductPageData(productSlug, variantSlug);
  if (!product) {
    return notFound();
  }
  const {
    sizes,
    specs,
    questions,
    category,
    store,
    reviews,
    reviewsStatistics,
    shippingDetails,
    productId,
    variantInfo,
    rating
  } = product;

  if (sizeId) {
    const isValidSize = sizes.some((size) => size.id === sizeId);
    if (!isValidSize) {
      return redirect(`/product/${productSlug}/${variantSlug}`);
    }
  } else if (sizes.length === 1) {
    return redirect(
      `/product/${productSlug}/${variantSlug}?size=${sizes[0].id}`
    );
  }

  const relatedProducts = await getProducts(
    { category: category.url },
    "",
    1,
    12
  );

  return (
    <div>
      <Header />
      <CategoriesHeader />
      <div className="max-w-[1650px] mx-auto p-4 overflow-x-hidden">
        {!product || typeof shippingDetails === "boolean" ? null : (
          <ProductPageContainer productData={product} sizeId={sizeId}>
            {relatedProducts.products && (
              <>
                <Separator />
                <RelatedProducts products={relatedProducts.products} />
              </>
            )}
            <Separator className="mt-6" />
            <ProductReviews
              productId={productId}
              rating={rating}
              statistics={reviewsStatistics}
              reviews={reviews}
              variantsInfo={variantInfo}
            />
            <Separator className="mt-6" />
            <ProductDescription
              text={[product.description, product.variantDescription || ""]}
            />
            {(specs.product.length > 0 || specs.variant.length > 0) && (
              <>
                <Separator className="mt-6" />
                <ProductSpecs specs={specs} />
              </>
            )}
            {questions.length > 0 && (
              <>
                <Separator className="mt-6" />
                <ProductQuestions questions={questions} />
              </>
            )}
            <Separator className="my-6" />
            <StoreCard store={store} />
            <StoreProducts
              storeUrl={store.url}
              storeName={store.name}
              count={5}
            />
          </ProductPageContainer>
        )}
      </div>
    </div>
  );
}
