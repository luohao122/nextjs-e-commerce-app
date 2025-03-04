"use client";

import { DashboardSidebarNavProps } from "@/components/dashboard/admin-dashboard-sidebar-nav/admin-dashboard-sidebar-nav.types";
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
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminDashboardSidebarNav({
  menuLinks,
}: DashboardSidebarNavProps) {
  const pathname = usePathname();

  // Compute the best matching link (the one with the longest match)
  const activeLink = menuLinks.reduce((best, link) => {
    if (pathname.startsWith(link.link) && link.link.length > best.length) {
      return link.link;
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
              const isActive = link.link === activeLink;

              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent text-accent-foreground": isActive,
                  })}
                >
                  <Link
                    href={link.link}
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
