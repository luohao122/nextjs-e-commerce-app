import { Prisma, ProductVariantImage, Size } from "@prisma/client";

import { getProductPageData, getProducts, retrieveProductDetails } from "@/queries/product.query";
import { getUserWishlist } from "@/queries/profile.query";

export type VariantSimplified = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type VariantImage = {
  url: string;
  image: string;
};

export type ProductPageType = Prisma.PromiseReturnType<
  typeof retrieveProductDetails
>;

export type ProductPageDataType = Prisma.PromiseReturnType<
  typeof getProductPageData
>;

export enum ProductStatus {
  Pending = "Pending",
  Processing = "Processing",
  ReadyForShipment = "ReadyForShipment",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Canceled = "Canceled",
  Returned = "Returned",
  Refunded = "Refunded",
  FailedDelivery = "FailedDelivery",
  OnHold = "OnHold",
  Backordered = "Backordered",
  PartiallyShipped = "PartiallyShipped",
  ExchangeRequested = "ExchangeRequested",
  AwaitingPickup = "AwaitingPickup",
}

export type ProductWishlistType = Prisma.PromiseReturnType<
  typeof getUserWishlist
>["wishlist"][0];

export type ProductType = Prisma.PromiseReturnType<
  typeof getProducts
>["products"][0];

export type ProductSize = {
  size: string;
  price: number;
  discount: number;
  quantity: number;
};

export type ProductSimpleVariantType = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  variantImage: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type ProductWithVariants = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  sales: number;
  numReviews: number;
  variants: {
    id: string;
    variantName: string;
    variantImage: string;
    slug: string;
    sizes: Size[];
    images: ProductVariantImage[];
  }[];
};

export type SimpleProduct = {
  name: string;
  slug: string;
  variantName: string;
  variantSlug: string;
  price: number;
  image: string;
};

export type VariantImageType = {
  url: string;
  image: string;
};
