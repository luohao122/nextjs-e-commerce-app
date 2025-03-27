"use client";

import { FC, useEffect, useState } from "react";

import {
  RatingStatisticsType,
  ReviewsFiltersType,
  ReviewsOrderType,
} from "@/types/types";
import RatingCard from "@/components/store/cards/product-rating/product-rating";
import RatingStatisticsCard from "@/components/store/cards/rating-statistics/rating-statistics";

import ReviewCard from "@/components/store/cards/review-card/review-card";
import { getProductFilteredReviews } from "@/queries/product.query";
import ReviewsFilters from "@/components/store/product-page/reviews/filters";

import ReviewsSort from "@/components/store/product-page/reviews/sort";
import Pagination from "@/components/store/shared/pagination/pagination";
import ReviewDetails from "@/components/store/forms/review-details/review-details";

import { ReviewWithImageType } from "@/types/review.types";
import { VariantInfoType } from "@/types/product-variant.types";

interface Props {
  productId: string;
  rating: number;
  statistics: RatingStatisticsType;
  reviews: ReviewWithImageType[];
  variantsInfo: VariantInfoType[];
}

const ProductReviews: FC<Props> = ({
  productId,
  rating,
  statistics,
  reviews,
  variantsInfo,
}) => {
  const [data, setData] = useState<ReviewWithImageType[]>(reviews);
  const { totalReviews, ratingStatistics } = statistics;
  const half = Math.ceil(data.length / 2);

  // Filtering
  const filtered_data = {
    rating: undefined,
    hasImages: undefined,
  };
  const [filters, setFilters] = useState<ReviewsFiltersType>(filtered_data);

  // Sorting
  const [sort, setSort] = useState<ReviewsOrderType>();

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(4);

  useEffect(() => {
    if (filters.rating || filters.hasImages || sort) {
      setPage(1);
      handleGetReviews();
    }
    if (page) {
      handleGetReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page]);

  const handleGetReviews = async () => {
    const res = await getProductFilteredReviews(
      productId,
      filters,
      sort,
      page,
      pageSize
    );
    setData(res);
  };

  return (
    <div id="reviews" className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">
          Custom Reviews ({totalReviews})
        </h2>
      </div>
      {/* Statistics */}
      <div className="w-full">
        <div className="flex items-center gap-4">
          <RatingCard rating={rating} />
          <RatingStatisticsCard statistics={ratingStatistics} />
        </div>
      </div>
      {totalReviews > 0 && (
        <>
          <div className="space-y-6">
            <ReviewsFilters
              filters={filters}
              setFilters={setFilters}
              setSort={setSort}
              stats={statistics}
            />
            <ReviewsSort sort={sort} setSort={setSort} />
          </div>
          {/* Reviews */}
          <div className="mt-6  grid grid-cols-2 gap-4">
            {data.length > 0 ? (
              <>
                <div className="flex flex-col gap-3">
                  {data.slice(0, half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {data.slice(half).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </>
            ) : (
              <>No Reviews.</>
            )}
          </div>
          {totalReviews > pageSize && (
            <Pagination
              page={page}
              totalPages={
                filters.rating || filters.hasImages
                  ? Math.ceil(data.length / pageSize)
                  : Math.ceil(totalReviews / pageSize)
              }
              setPage={setPage}
            />
          )}
        </>
      )}
      <div className="mt-10">
        <ReviewDetails
          productId={productId}
          variantsInfo={variantsInfo}
          setReviews={setData}
          reviews={data}
        />
      </div>
    </div>
  );
};

export default ProductReviews;
