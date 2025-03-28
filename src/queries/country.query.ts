import { db } from "@/lib/db";
import { SortOrder } from "@/types/types";

export const getCountryList = async (orderBy: SortOrder = "asc") => {
  const countries = await db.country.findMany({
    orderBy: { name: orderBy },
  });
  return countries;
};
