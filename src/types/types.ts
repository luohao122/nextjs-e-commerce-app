import { Prisma } from "@prisma/client";

import countries from "@/data/countries.json";
import { getRatingStatistics } from "@/queries/product.query";

export interface Country {
  name: string;
  code: string;
  city: string;
  region: string;
}

export interface IPCountryPayload {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

export type SelectMenuOption = (typeof countries)[number];

export type ReviewsFiltersType = {
  rating?: number;
  hasImages?: boolean;
};

export type RatingStatisticsType = Prisma.PromiseReturnType<
  typeof getRatingStatistics
>;

export type ReviewsOrderType = {
  orderBy: "latest" | "oldest" | "highest";
};

export type SortOrder = "asc" | "desc";

export interface SearchResult {
  name: string;
  link: string;
  image: string;
}
