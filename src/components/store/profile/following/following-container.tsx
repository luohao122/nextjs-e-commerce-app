"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FollowingContainerProps } from "@/components/store/profile/following/following-container.types";
import StoreCard from "@/components/store/cards/store-card/store-card";
import Pagination from "@/components/store/shared/pagination/pagination";

const FollowingContainer: FC<FollowingContainerProps> = ({
  page,
  stores,
  totalPages,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(page);

  useEffect(() => {
    if (currentPage !== page) {
      router.push(`/profile/following/${currentPage}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, page]);

  return (
    <div>
      <div className="flex flex-wrap pb-16">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
      <Pagination
        page={page}
        setPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default FollowingContainer;
