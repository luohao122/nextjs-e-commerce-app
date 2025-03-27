import { Color, ProductVariantImage, Size } from "@prisma/client";

export type VariantInfoType = {
  variantName: string;
  variantSlug: string;
  variantImage: string;
  variantUrl: string;
  images: ProductVariantImage[];
  sizes: Size[];
  colors: Partial<Color>[];
};
