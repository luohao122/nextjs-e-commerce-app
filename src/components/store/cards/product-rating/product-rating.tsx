"use client";

import StarRatings from "react-star-ratings";

export default function RatingCard({ rating }: { rating: number }) {
  const fixedRating = Number(rating.toFixed(2));

  return (
    <div className="h-44 flex-1">
      <div className="p-6 bg-[#f5f5f5] flex flex-col h-full justify-center overflow-hidden rounded-lg">
        <div className="text-6xl font-bold">{rating}</div>
        <div className="py-1.5">
          <StarRatings
            rating={fixedRating}
            starRatedColor="#ffb400"
            starEmptyColor="#e2dfdf"
            numberOfStars={5}
            starDimension="19px"
            starSpacing="2px"
          />
        </div>
        <div className="text-[#03c97a] leading-5 mt-2">
          All from verified purchases
        </div>
      </div>
    </div>
  );
}
