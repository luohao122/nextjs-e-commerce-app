import { getProducts } from "@/queries/product.query";
import { Prisma } from "@prisma/client";

export type ProductType = Prisma.PromiseReturnType<
  typeof getProducts
>["products"][0];

export interface ProductListProps {
  products: ProductType[];
  title?: string;
  link?: string;
  arrow?: boolean;
}
