"use client";

import { useState } from "react";
import Link from "next/link";
import StarRatings from "react-star-ratings";

import { Heart } from "lucide-react";

import { ProductType } from "@/components/store/shared/product-list/product-list.types";
import { VariantSimplified } from "@/types/product.types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/store/ui/button";
import ProductCardImageSwiper from "@/components/store/cards/product/swiper";
import VariantSwitcher from "./variant-swicher";

import { addToWishlist } from "@/queries/user.query";
import { useToast } from "@/hooks/use-toast";
import ProductPrice from "@/components/store/product-page/product-price/product-price";

export default function ProductCard({ product }: { product: ProductType }) {
  const { name, slug, rating, sales, variantImages, variants, id } = product;
  const [variant, setVariant] = useState<VariantSimplified>(variants[0]);
  const { variantSlug, variantName, images, sizes } = variant;
  const { toast } = useToast();

  const handleaddToWishlist = async () => {
    try {
      const res = await addToWishlist(id, variant.variantId);
      if (res) {
        toast({
          title: "",
          description: "Product successfully added to wishlist.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Failed to wishlist",
        description: error.toString(),
      });
    }
  };
  return (
    <div>
      <div
        className={cn(
          "group w-48 sm:w-[225px] relative transition-all duration-75 bg-white ease-in-out p-4 rounded-t-3xl border border-transparent hover:shadow-xl hover:border-border"
        )}
      >
        <div className="relative w-full h-full">
          <Link
            className="w-full relative inline-block overflow-hidden"
            href={`/product/${slug}/${variantSlug}`}
          >
            <ProductCardImageSwiper images={images} />
            <div className="text-sm text-main-primary h-[18px] overflow-hidden overflow-ellipsis line-clamp-1">
              {name} . {variantName}
            </div>
            {product.rating > 0 && product.sales > 0 && (
              <div className="flex items-center gap-x-1 h-5">
                <StarRatings
                  rating={rating}
                  starRatedColor="#FFD804"
                  starEmptyColor="#F5F5F5"
                  numberOfStars={5}
                  starDimension="19px"
                  starSpacing="2px"
                />
                <div className="text-xs text-main-primary">{sales} sold</div>
              </div>
            )}
            <ProductPrice sizes={sizes} isCard handleChange={() => {}} />
          </Link>
        </div>
        <div className="hidden group-hover:block absolute -left-[1px] bg-white border border-t-0 w-[calc(100%+2px)] px-4 pb-4 rounded-b-3xl shadow-xl z-30 space-y-2">
          <VariantSwitcher
            images={variantImages}
            variants={variants}
            setVariant={setVariant}
            selectedVariant={variant}
          />
          <div className="flex flex-items gap-x-1">
            <Button>
              <Link href={`/product/${slug}/${variantSlug}`}>Add to cart</Link>
            </Button>
            <Button variant="black" size="icon" onClick={handleaddToWishlist}>
              <Heart className="w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
