import { ReviewDateFilter, ReviewFilter } from "@/types/review.types";
import { Dispatch, SetStateAction } from "react";

export interface ReviewsHeaderProps {
  filter: ReviewFilter;
  setFilter: Dispatch<SetStateAction<ReviewFilter>>;
  period: ReviewDateFilter;
  setPeriod: Dispatch<SetStateAction<ReviewDateFilter>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

