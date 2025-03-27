import { ProductVariantImage } from "@prisma/client";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";

import Image from "next/image";

import { VariantInfoType } from "@/types/product-variant.types";
import { cn } from "@/lib/utils";

interface ProductVariantSelectorProps {
  variants: VariantInfoType[];
  slug: string;
  setVariantImages: Dispatch<SetStateAction<ProductVariantImage[]>>;
  setActiveImage: Dispatch<SetStateAction<ProductVariantImage | null>>;
}

const ProductVariantSelector: FC<ProductVariantSelectorProps> = ({
  variants,
  slug,
  setActiveImage,
  setVariantImages,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {variants.map((variant, i) => (
        <Link
          key={i}
          href={variant.variantUrl}
          onMouseEnter={() => {
            setVariantImages(variant.images);
            setActiveImage(variant.images[0]);
          }}
          onMouseLeave={() => {
            setVariantImages([]);
            setActiveImage(null);
          }}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full grid place-items-center p-0.5 overflow-hidden border border-transparent hover:border-main-primary cursor-pointer transition-all duration-75 ease-in",
              {
                "border-main-primary": slug === variant.variantSlug,
              }
            )}
          >
            <Image
              src={variant.variantImage}
              alt={`product variant ${variant.variantName}`}
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductVariantSelector;
