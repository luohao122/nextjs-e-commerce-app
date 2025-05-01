"use client";

import { FC, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { CategoryWithSubsType } from "@/types/categories.types";
import CategoryLink from "@/components/store/browse-page/filters/category-link/category-link";

const CategoriesFilters: FC<{ categories: CategoryWithSubsType[] }> = ({
  categories,
}) => {
  const [show, setShow] = useState<boolean>(true);

  return (
    <div className="pt-5 pb-4">
      {/* Header */}
      <div
        onClick={() => setShow((prev) => !prev)}
        className="relative cursor-pointer flex items-center justify-between select-none"
      >
        <h3 className="text-sm font-bold overflow-ellipsis capitalize line-clamp-1 text-main-primary">
          Category
        </h3>
        <span className="absolute right-0">
          {show ? <Minus className="w-3" /> : <Plus className="w-3" />}
        </span>
      </div>
      {/* Filter */}
      <div
        className={cn("mt-2.5", {
          hidden: !show,
        })}
      >
        {categories.map((category) => (
          <CategoryLink key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesFilters;
