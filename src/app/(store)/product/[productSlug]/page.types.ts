type ProductPageParams = Promise<{ productSlug: string }>;

export interface ProductPageProps {
  params: ProductPageParams;
}
