import { Prisma } from "@prisma/client";

import countries from "@/data/countries.json";
import { getRatingStatistics } from "@/queries/product.query";
import {
  getAllStores,
  getStoreOrders,
  getStorePageDetails,
} from "@/queries/store.query";

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

export type FiltersQueryType = {
  search: string;
  category: string;
  subCategory: string;
  offer: string;
  size: string;
  sort: string;
  minPrice: string; // Added minPrice
  maxPrice: string; // Added maxPrice
  color: string; // New color filter field
};

export type SearchParamsType = Promise<{
  search: string;
  category: string;
  subCategory: string;
  offer: string;
  size: string;
  sort: string;
  minPrice: string; // Added minPrice
  maxPrice: string; // Added maxPrice
  color: string; // New color filter field
}>;

export type StoreType = {
  name: string;
  description: string;
  email: string;
  phone: string;
  logo: string;
  cover: string;
  url: string;
  defaultShippingService: string;
  defaultDeliveryTimeMax?: number;
  defaultDeliveryTimeMin?: number;
  defaultShippingFeeFixed?: number;
  defaultShippingFeeForAdditionalItem?: number;
  defaultShippingFeePerItem?: number;
  defaultShippingFeePerKg?: number;
  returnPolicy?: string;
};

export type StoreDetailsType = Prisma.PromiseReturnType<
  typeof getStorePageDetails
>;

export type AdminStoreType = Prisma.PromiseReturnType<typeof getAllStores>[0];

export enum StoreStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
  DISABLED = "DISABLED",
}

export type StoreOrderType = Prisma.PromiseReturnType<typeof getStoreOrders>[0];
