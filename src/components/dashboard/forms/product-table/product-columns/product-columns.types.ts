import { Prisma } from "@prisma/client";

import { getAllStoreProducts } from "@/queries/product.query";

export type StoreProduct = Prisma.PromiseReturnType<
  typeof getAllStoreProducts
>[0];

export interface CellActionsProps {
  productId: string;
}
