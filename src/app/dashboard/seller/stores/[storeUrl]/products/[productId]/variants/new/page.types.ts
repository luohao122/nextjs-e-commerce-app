type NewProductVariantParams = Promise<{ storeUrl: string; productId: string }>;

export interface SellerNewProductVariantPageProps {
  params: NewProductVariantParams;
}
