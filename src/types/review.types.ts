import { Prisma, Review, ReviewImage, User } from "@prisma/client";

import { getRatingStatistics } from "@/queries/product.query";

export type ReviewWithImageType = Review & {
  images: ReviewImage[];
  user: User;
};

export type StatisticsCardType = Prisma.PromiseReturnType<
  typeof getRatingStatistics
>["ratingStatistics"];

export type ReviewDetailsType = {
  id: string;
  review: string;
  rating: number;
  images: { url: string }[];
  size: string;
  quantity: string;
  variant: string;
  color: string;
};

export type ReviewFilter = "5" | "4" | "3" | "2" | "1" | "";

export type ReviewDateFilter =
  | ""
  | "last-6-months"
  | "last-1-year"
  | "last-2-years";
