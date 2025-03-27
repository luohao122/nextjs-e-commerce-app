"use client";

import { useEffect, useState } from "react";

import {
  ReviewDateFilter,
  ReviewFilter,
  ReviewWithImageType,
} from "@/types/review.types";
import Pagination from "@/components/store/shared/pagination/pagination";
import { getUserReviews } from "@/queries/profile.query";

import ReviewCard from "@/components/store/cards/review-card/review-card";
import ReviewsHeader from "@/components/store/profile/reviews/reviews-header/reviews-header";
import { ReviewsContainerProps } from "@/components/store/profile/reviews/reviews-container/reviews-container.types";

export default function ReviewsContainer({
  reviews,
  totalPages,
}: ReviewsContainerProps) {
  const [data, setData] = useState<ReviewWithImageType[]>(reviews);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalDataPages, setTotalDataPages] = useState<number>(totalPages);

  // Filter
  const [filter, setFilter] = useState<ReviewFilter>("");

  // Date period filter
  const [period, setPeriod] = useState<ReviewDateFilter>("");

  // Search filter
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    // Reset to page 1 when filters or search changes
    setPage(1);
  }, [filter, period, search]);

  useEffect(() => {
    const getData = async () => {
      const res = await getUserReviews(filter, period, search, page);
      if (res) {
        setData(res.reviews);
        setTotalDataPages(res.totalPages);
      }
    };
    getData();
  }, [page, filter, search, period]);
  return (
    <div>
      <div className="">
        {/* Header */}
        <ReviewsHeader
          filter={filter}
          setFilter={setFilter}
          period={period}
          setPeriod={setPeriod}
          search={search}
          setSearch={setSearch}
        />
        {/* Table */}
        <div className="space-y-2">
          {data.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
      <div className="mt-2">
        <Pagination page={page} setPage={setPage} totalPages={totalDataPages} />
      </div>
    </div>
  );
}
