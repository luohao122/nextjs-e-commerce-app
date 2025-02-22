import { Prisma } from "@prisma/client";

import { getAllSubCategories } from "@/queries/sub-category.query";

export interface CellActionsProps {
  rowData: SubCategoryWithCategory;
}

export type SubCategoryWithCategory = Prisma.PromiseReturnType<typeof getAllSubCategories>[0]