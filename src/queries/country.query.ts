import { db } from "@/lib/db";

export const getCountryList = async () => {
  const countries = await db.country.findMany({
    orderBy: { name: "desc" },
  });
  return countries;
};
