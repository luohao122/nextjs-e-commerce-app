"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { icons } from "@/config/icons";

import { cn } from "@/lib/utils";
import { SellerDashboardSidebarNavProps } from "@/components/dashboard/seller-dashboard-sidebar-nav/seller-dashboard-sidebar-nav.types";

export default function SellerDashboardSidebarNav({
  menuLinks,
}: SellerDashboardSidebarNavProps) {
  const pathname = usePathname();
  const params = useParams<{ storeUrl: string }>();
  const activeStore = params.storeUrl;

  // Compute the best matching link (the one with the longest match)
  const activeLink = menuLinks.reduce((best, link) => {
    if (
      pathname.startsWith(
        `/dashboard/seller/stores/${activeStore}/${link.link}`
      ) &&
      `/dashboard/seller/stores/${activeStore}/${link.link}`.length >
        best.length
    ) {
      return `/dashboard/seller/stores/${activeStore}/${link.link}`;
    }
    return best;
  }, "");

  return (
    <nav className="relative grow">
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>No Links Found.</CommandEmpty>
          <CommandGroup className="overflow-visible pt-0 relative">
            {menuLinks.map((link, index) => {
              let Icon;
              const IconSearch = icons.find((icon) => icon.value === link.icon);
              if (IconSearch) {
                Icon = <IconSearch.path />;
              }
              // Mark active only if this link is the best match
              const isActive =
                link.link === ""
                  ? pathname === `/dashboard/seller/stores/${activeStore}`
                  : `/dashboard/seller/stores/${activeStore}/${link.link}` ===
                    activeLink;

              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent text-accent-foreground": isActive,
                  })}
                >
                  <Link
                    href={`/dashboard/seller/stores/${activeStore}/${link.link}`}
                    className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                  >
                    {Icon}
                    <span>{link.label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
}
