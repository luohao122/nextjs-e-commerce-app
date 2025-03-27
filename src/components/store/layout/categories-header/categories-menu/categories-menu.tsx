import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ChevronDown, Menu } from "lucide-react";

import { CategoriesMenuProps } from "@/components/store/layout/categories-header/categories-menu/categories-menu.types";
import { cn } from "@/lib/utils";

export default function CategoriesMenu({
  categories,
  open,
  setOpen,
}: CategoriesMenuProps) {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const toggleMenu = (state: boolean) => {
    setOpen(state);
    if (state) {
      setTimeout(() => {
        setDropdownVisible(true);
      }, 100);
    } else {
      setDropdownVisible(false);
    }
  };

  return (
    <div
      onMouseEnter={() => toggleMenu(true)}
      onMouseLeave={() => toggleMenu(false)}
      className="relative w-10 h-10 xl:w-[256px] z-50"
    >
      <div className="relative">
        <div
          className={cn(
            "w-12 xl:w-[256px] h-12 rounded-full -translate-y-1 xl:translate-y-0 xl:h-11 bg-[#535353] text-white text-[20px] relative flex items-center cursor-pointer transition-all duration-100 ease-in-out",
            {
              "w-[256px] bg-[#f5f5f5] text-black text-base rounded-t-[20px] rounded-b-none scale-100":
                open,
              "scale-75": !open,
            }
          )}
        >
          <Menu
            className={cn("absolute top-1/2 -translate-y-1/2 xl:ml-1", {
              "left-5": open,
              "left-3": !open,
            })}
          />
          <span
            className={cn("hidden xl:inline-flex xl:ml-11", {
              "inline-flex !ml-14": open,
            })}
          >
            All Categories
          </span>
          <ChevronDown
            className={cn("hidden xl:inline-flex scale-75 absolute right-3", {
              "inline-flex": open,
            })}
          />
        </div>
        <ul
          className={cn(
            "absolute top-10 left-0 w-[256px] bg-[#f5f5f5] shadow-lg transition-all duration-100 ease-in-out overflow-y-auto",
            {
              "max-h-[523px] opacity-100": dropdownVisible,
              "max-h-0 opacity-0": !dropdownVisible,
            }
          )}
        >
          {categories.map((category) => (
            <Link
              href={`/browse?category=${category.url}`}
              key={category.id}
              className="text-[#222]"
            >
              <li className="relative flex items-center m-0 p-3 pl-6 hover:bg-white">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={100}
                  height={100}
                  className="w-[18px] h-[18px]"
                />
                <span className="text-sm font-normal ml-2 overflow-hidden line-clamp-2 break-words text-main-primary">
                  {category.name}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
