import { Category } from "@prisma/client";

export interface CategoryDetailsProps {
  data?: Category;
  cloudinaryKey: string;
}
