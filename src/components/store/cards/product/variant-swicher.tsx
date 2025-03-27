import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";
import { VariantImage, VariantSimplified } from "@/types/product.types";

interface VariantSwitcherProps {
  images: VariantImage[];
  variants: VariantSimplified[];
  setVariant: Dispatch<SetStateAction<VariantSimplified>>;
  selectedVariant: VariantSimplified;
}

export default function VariantSwitcher({
  images,
  variants,
  selectedVariant,
  setVariant,
}: VariantSwitcherProps) {
  return (
    <div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {images.map((image, idx) => (
            <Link
              className={cn("p-0.5 rounded-full border-2 border-transparent", {
                "border-border": variants[idx] === selectedVariant,
              })}
              onMouseEnter={() => setVariant(variants[idx])}
              href={image.url}
              key={idx}
            >
              <Image
                src={image.image}
                alt=""
                width={100}
                height={100}
                className="w-8 h-8 object-cover rounded-full"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
