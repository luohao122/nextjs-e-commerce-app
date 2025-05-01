import { getHomeFeaturedCategories } from "@/queries/home.query";
import { Category, Prisma, SubCategory } from "@prisma/client";

export type CategoryWithSubsType = Category & {
  subCategories: SubCategory[];
};

export type FeaturedCategoryType = Prisma.PromiseReturnType<
  typeof getHomeFeaturedCategories
>[0];
