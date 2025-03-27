"use client";

import StarRatings from "react-star-ratings";

import { StatisticsCardType } from "@/types/review.types";

export default function RatingStatisticsCard({
  statistics,
}: {
  statistics: StatisticsCardType;
}) {
  return (
    <div className="h-44 flex-1">
      <div className="py-5 px-7 bg-[#f5f5f5] flex flex-col gap-y-2 h-full justify-center overflow-hidden rounded-lg">
        {statistics
          .slice()
          .reverse()
          .map((rating) => (
            <div key={rating.rating} className="flex items-center h-4">
              <StarRatings
                rating={rating.rating}
                starRatedColor="#ffb400"
                starEmptyColor="#e2dfdf"
                numberOfStars={5}
                starDimension="19px"
                starSpacing="2px"
              />
              <div className="relative w-full flex-1 h-1.5 mx-2.5 bg-[#e2dfdf] rounded-full">
                <div
                  className="absolute left-0 h-full rounded-full bg-[#ffc50A]"
                  style={{ width: `${rating.percentage}%` }}
                />
              </div>
              <div className="text-xs w-12 leading-4">{rating.numReviews}</div>
            </div>
          ))}
      </div>
    </div>
  );
}