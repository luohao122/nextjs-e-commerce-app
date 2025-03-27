import { Category, OfferTag } from "@prisma/client";

export interface CategoriesHeaderContainerProps {
  categories: Category[];
  offerTags: OfferTag[];
}
