import { Category, Country, OfferTag, ShippingFeeMethod } from "@prisma/client";

export type ProductWithVariantType = {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  variantImage: string;
  images: { id?: string; url: string }[];
  categoryId: string;
  offerTagId: string;
  subCategoryId: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  weight: number;
  seoTitle: string;
  seoDescription: string;
  colors: { id?: string; color: string }[];
  sizes: {
    id?: string;
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  product_specs: { id?: string; name: string; value: string }[];
  variant_specs: { id?: string; name: string; value: string }[];
  questions: { id?: string; question: string; answer: string }[];
  keywords: string[];
  freeShippingForAllCountries: boolean;
  freeShippingCountriesIds: { id?: string; label: string; value: string }[];
  shippingFeeMethod: ShippingFeeMethod;
  createdAt: Date;
  updatedAt: Date;
};

export interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  cloudinaryKey: string;
  categories: Category[];
  storeUrl: string;
  offerTags: OfferTag[];
  countries: Country[]
}

export type CountryOption = {
  label: string;
  value: string;
};