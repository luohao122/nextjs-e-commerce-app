import Link from "next/link";

import { OfferTagsLinksProps } from "@/components/store/layout/categories-header/offer-tags-links/offer-tags-links.types";
import { cn } from "@/lib/utils";
import { useBreakpointValue } from "@/components/store/layout/categories-header/offer-tags-links/use-breakpoints";

export default function OfferTagsLinks({ offerTags }: OfferTagsLinksProps) {
  const breakpoint = useBreakpointValue();

  return (
    <div className="w-fit relative">
      <div className="flex items-center flex-wrap xl:-translate-x-4 transition-all duration-100 ease-in-out">
        {offerTags.slice(0, breakpoint).map((tag, idx) => (
          <Link
            key={tag.id}
            href={`/browse?offer=${tag.url}`}
            className={cn(
              "font-bold text-center text-white px-4 leading-10 rounded-[20px] hover:bg-cyan-900",
              {
                "text-amber-600": idx === 0,
              }
            )}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
