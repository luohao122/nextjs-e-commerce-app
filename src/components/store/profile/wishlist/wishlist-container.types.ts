import { ProductWishlistType } from "@/types/product.types";

export interface WishlistContainerProps {
  products: ProductWishlistType[];
  page: number;
  totalPages: number;
}