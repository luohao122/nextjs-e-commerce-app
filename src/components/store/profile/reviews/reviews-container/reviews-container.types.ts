import { ReviewWithImageType } from "@/types/review.types";

export interface ReviewsContainerProps {
  reviews: ReviewWithImageType[];
  totalPages: number;
}
