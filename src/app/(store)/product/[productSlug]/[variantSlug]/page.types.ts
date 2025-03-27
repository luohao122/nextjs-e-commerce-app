type ProductVariantPageParams = Promise<{
  variantSlug: string;
  productSlug: string;
}>;

type ProductVariantPageSearchParams = Promise<{ size?: string }>;

export interface ProductVariantPageProps {
  params: ProductVariantPageParams;
  searchParams: ProductVariantPageSearchParams;
}
