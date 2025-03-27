"use client";

import { useState } from "react";

import CategoriesMenu from "@/components/store/layout/categories-header/categories-menu/categories-menu";
import { CategoriesHeaderContainerProps } from "@/components/store/layout/categories-header/categories-header-container/categories-header-container.types";
import OfferTagsLinks from "@/components/store/layout/categories-header/offer-tags-links/offer-tags-links";

export default function CategoriesHeaderContainer({
  categories,
  offerTags,
}: CategoriesHeaderContainerProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="w-full px-4 flex items-center gap-x-1">
      <CategoriesMenu categories={categories} open={open} setOpen={setOpen} />
      <OfferTagsLinks offerTags={offerTags} />
    </div>
  );
}
