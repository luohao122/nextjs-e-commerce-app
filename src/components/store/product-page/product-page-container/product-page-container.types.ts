import { ReactNode } from "react";

import { ProductPageDataType } from "@/types/product.types";

export interface ProductPageContainerProps {
  productData: NonNullable<ProductPageDataType>;
  sizeId: string | undefined;
  children: ReactNode;
}
