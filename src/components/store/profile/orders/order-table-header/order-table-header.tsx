import { FC, useEffect, useState } from "react";
import { ChevronDown, Delete, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { OrderTableDateFilter, OrderTableFilter } from "@/types/order.types";
import { cn } from "@/lib/utils";
import { OrderTableHeaderProps } from "@/components/store/profile/orders/order-table-header/order-table-header.types";

const OrderTableHeader: FC<OrderTableHeaderProps> = ({
  filter,
  setFilter,
  search,
  setSearch,
  period,
  setPeriod,
}) => {
  const router = useRouter();

  // Handle debounced search input
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

  // Update parent search state when the debounced search changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedSearch.length >= 3) {
        // Start searching after 3 characters
        setSearch(debouncedSearch);
      }
    }, 500); // Debounce time, adjust as needed
    return () => clearTimeout(handler);
  }, [debouncedSearch, setSearch]);

  return (
    <div className="pt-4 px-6 bg-white">
      <div className="flex items-center justify-between">
        <div className="-ml-3 text-main-primary text-sm">
          <div className="relative overflow-x-hidden">
            <div className="py-4 inline-flex items-center bg-white justify-center relative">
              {filters.map((f) => (
                <div
                  key={f.filter}
                  className={cn(
                    "relative px-4 text-main-primary whitespace-nowrap cursor-pointer leading-6",
                    {
                      "user-orders-table-tr font-bold": f.filter === filter,
                    }
                  )}
                  onClick={() => {
                    if (f.filter === "") {
                      router.refresh();
                      setFilter(f.filter);
                    } else {
                      setFilter(f.filter);
                    }
                  }}
                >
                  {f.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="mt-0.5 text-xs cursor-pointer"
          onClick={() => {
            setFilter("");
            setDebouncedSearch("");
            setSearch("");
          }}
        >
          <span className="mx-1.5 inline-block translate-y-0.5">
            <Delete />
          </span>
          Remove all filters
        </div>
      </div>
      {/* Search form - Date filter */}
      <div className="flex items-center justify-between mt-3">
        <div className="w-[500px] text-main-primary text-sm leading-6 relative flex">
          {/* Select */}
          <div className="relative mb-4 w-fit">
            <select className="h-8 px-4 w-24 appearance-none outline-none cursor-pointer hover:border-[1px] hover:border-black border rounded-l-md">
              <option value="">
                <div className="flex h-8 text-left text-sm overflow-hidden">
                  <span className="flex-1 whitespace-nowrap">Order</span>
                </div>
              </option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown />
            </span>
          </div>
          {/* Input */}
          <input
            type="text"
            placeholder="Order ID, product or store name"
            className="h-8 border text-sm relative inline-block w-full py-[3px] px-3 text-main-primary leading-6 bg-white  transition-all duration-75 placeholder:text-xs"
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
          />
          {/* Search icon */}
          <span className="-ml-[1px] rounded-r-md relative bg-white text-center">
            <button className="rounded-r-md min-w-[52px] h-8 text-white bg-[linear-gradient(90deg,_#ff640e,_#ff3000)] grid place-items-center">
              <span className="text-2xl inline-block ">
                <Search />
              </span>
            </button>
          </span>
        </div>
        {/* Filter by date */}
        <div className="flex items-center">
          {/* Select */}
          <div className="relative mb-4 w-fit">
            <select
              className="h-8 px-4 w-40 appearance-none outline-none cursor-pointer hover:border-[1px] hover:border-black border rounded-md"
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as OrderTableDateFilter)
              }
            >
              {date_filters.map((filter) => (
                <option
                  key={filter.value}
                  value={filter.value}
                  className="flex h-8 text-left text-sm overflow-hidden"
                >
                  <span className="flex-1 whitespace-nowrap">
                    {filter.title}
                  </span>
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTableHeader;

const filters: { title: string; filter: OrderTableFilter }[] = [
  {
    title: "View all",
    filter: "",
  },
  {
    title: "To pay",
    filter: "unpaid",
  },
  {
    title: "To ship",
    filter: "toShip",
  },
  {
    title: "Shipped",
    filter: "shipped",
  },
  {
    title: "Delivered",
    filter: "delivered",
  },
];

const date_filters: { title: string; value: OrderTableDateFilter }[] = [
  {
    title: "All time",
    value: "",
  },
  {
    title: "last 6 months",
    value: "last-6-months",
  },
  {
    title: "last 1 year",
    value: "last-1-year",
  },
  {
    title: "last 2 years",
    value: "last-2-years",
  },
];
