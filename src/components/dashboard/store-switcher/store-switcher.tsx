"use client";

import { FC, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";

import { StoreSwitcherProps } from "@/components/dashboard/store-switcher/store-switcher.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ROUTES } from "@/config/route-name";

const StoreSwitcher: FC<StoreSwitcherProps> = ({ stores, className }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const formattedItems = stores.map((store) => ({
    label: store.name,
    value: store.url,
  }));

  const activeStore = formattedItems.find(
    (item) => item.value === params.storeUrl
  );

  const onStoreSelect = (selectedStore: string) => {
    setOpen(false);
    router.push(`${ROUTES.SELLER_STORES_LIST}/${selectedStore}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[250px] justify-between", className)}
        >
          <StoreIcon className="mr-2 w-4 h-4" />
          {activeStore?.label || "Select a Store"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search stores..." />
            <CommandEmpty>No Store selected.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store.value)}
                  className="text-sm cursor-pointer"
                >
                  <StoreIcon className="mr-2 w-4 h-4" />
                  {store.label}
                  {activeStore?.value === store.value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                router.push(ROUTES.SELLER_CREATE_STORE);
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Store
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
