"use client";

import { Dispatch, FC, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";

import { ProductVariantImage } from "@prisma/client";
import { CopyIcon } from "lucide-react";
import StarRatings from "react-star-ratings";

import { ProductPageDataType } from "@/types/product.types";
import { Separator } from "@/components/ui/separator";
import ProductPrice from "@/components/store/product-page/product-price/product-price";

import { useToast } from "@/hooks/use-toast";
import Countdown from "@/components/store/shared/count-down/count-down";
import ColorWheel from "@/components/shared/color-wheel";

import ProductVariantSelector from "@/components/store/product-page/product-info/product-variant-selector/product-variant-selector";
import ProductSizeSelector from "@/components/store/product-page/product-info/product-size-selector/product-size-selector";
import ProductAssurancePolicy from "@/components/store/product-page/product-info/product-assurance-policy/product-assurance-policy";

import { CartProductType } from "@/types/cart.types";
import ProductWatch from "@/components/store/product-page/product-watch/product-watch";

interface ProductInfoProps {
  productData: ProductPageDataType;
  quantity?: number;
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: unknown) => void;
  setVariantImages: Dispatch<SetStateAction<ProductVariantImage[]>>;
  setActiveImage: Dispatch<SetStateAction<ProductVariantImage | null>>;
}

const ProductInfo: FC<ProductInfoProps> = ({
  productData,
  sizeId,
  setActiveImage,
  setVariantImages,
  handleChange,
}) => {
  const { toast } = useToast();

  if (!productData) {
    return null;
  }

  const {
    name,
    sku,
    colors,
    variantInfo,
    sizes,
    isSale,
    saleEndDate,
    variantName,
    variantId,
    store,
    rating,
    reviewsStatistics,
  } = productData;

  const { totalReviews } = reviewsStatistics;

  const copySkuToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku);
      toast({
        title: "Copied to clipboard",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to copy SKU",
        duration: 1,
      });
    }
  };

  return (
    <div className="relative w-full xl:w-[540px]">
      {/* Title */}
      <div>
        <h1 className="text-main-primary inline font-bold leading-5">
          {name} · {variantName}
        </h1>
      </div>
      {/* Sku - Rating - Num reviews */}
      <div className="flex items-center text-xs mt-2">
        {/* Store details */}
        <Link
          href={`/store/${store.url}`}
          className="hidden sm:inline-block md:hidden lg:inline-block mr-2 hover:underline"
        >
          <div className="w-full flex items-center gap-x-1">
            <Image
              src={store.logo}
              alt={store.name}
              width={100}
              height={100}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </Link>
        {/* Sku - Rating - Num reviews */}
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">
            SKU: {sku}
          </span>
          <span
            className="inline-block align-middle text-[#2F68A8] mx-1 cursor-pointer"
            onClick={copySkuToClipboard}
          >
            <CopyIcon />
          </span>
        </div>
        <div className="ml-4 flex items-center gap-x-2 flex-1 whitespace-nowrap">
          <StarRatings
            rating={rating}
            starRatedColor="#FFD804"
            starEmptyColor="#F5F5F5"
            numberOfStars={5}
            starDimension="19px"
            starSpacing="2px"
          />
          <Link href="#reviews" className="text-[#ffd804] hover:underline">
            (
            {totalReviews === 0
              ? "No review yet"
              : totalReviews === 1
              ? "1 review"
              : `${totalReviews} reviews`}
            )
          </Link>
        </div>
      </div>
      {/* Price - Sale countdown */}
      <div className="my-2 relative flex flex-col sm:flex-row justify-between">
        <ProductPrice
          sizeId={sizeId}
          sizes={sizes}
          handleChange={handleChange}
        />
        {isSale && saleEndDate && (
          <div className="mt-4 pb-2">
            <Countdown targetDate={saleEndDate} />
          </div>
        )}
      </div>
      {/* Product live watchers count */}
      {/* <ProductWatch productId={variantId} /> */}
      <Separator className="mt-2" />
      {/* Color wheel - variant switcher */}
      <div className="mt-4 space-y-2">
        <div className="relative flex items-center justify-between text-main-primary font-bold">
          <span className="flex items-center gap-x-2">
            {colors.length > 1 ? "Colors" : "Color"}
            <ColorWheel colors={colors} size={25} />
          </span>
        </div>
        <div className="mt-4">
          {variantInfo.length > 0 && (
            <ProductVariantSelector
              variants={variantInfo}
              slug={productData.variantSlug}
              setVariantImages={setVariantImages}
              setActiveImage={setActiveImage}
            />
          )}
        </div>
      </div>
      {/* Size selector */}
      <div className="space-y-2 pb-2 mt-4">
        <div>
          <h1 className="text-main-primary font-bold">Size </h1>
        </div>
        <ProductSizeSelector
          sizes={sizes}
          sizeId={sizeId}
          handleChange={handleChange}
        />
      </div>
      {/* Product assurance */}
      <Separator className="mt-2" />
      <ProductAssurancePolicy />
    </div>
  );
};

export default ProductInfo;
