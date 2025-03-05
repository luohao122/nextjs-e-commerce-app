import { Category } from "@prisma/client";

export type ProductWithVariantType = {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  variantImage: string;
  images: { url: string }[];
  categoryId: string;
  subCategoryId: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  seoTitle: string;
  seoDescription: string;
  colors: { color: string }[];
  sizes: { size: string; quantity: number; price: number; discount: number }[];
  product_specs: { name: string; value: string }[];
  variant_specs: { name: string; value: string }[];
  questions: { question: string; answer: string }[];
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
};

export interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  cloudinaryKey: string;
  categories: Category[];
  storeUrl: string;
}
