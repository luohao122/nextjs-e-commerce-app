import { Category, SubCategory } from "@prisma/client";

export interface SubCategoryDetailsProps {
  data?: SubCategory;
  cloudinaryKey: string;
  categories: Category[];
}
