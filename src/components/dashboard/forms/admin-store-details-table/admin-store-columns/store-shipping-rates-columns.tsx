"use client";

import Image from "next/image";
import { BadgeCheck, BadgeMinus, Expand } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import CustomModal from "@/components/dashboard/shared/custom-modal/custom-modal";
import { AdminStoreType, StoreStatus } from "@/types/types";
import StoreStatusSelect from "@/components/dashboard/forms/store-status-select/store-status-select";

import StoreSummary from "@/components/dashboard/shared/store-summary/store-summary";
import { useModal } from "@/contexts/modal-provider";
import CellActions from "@/components/dashboard/forms/admin-store-details-table/admin-store-columns/store-shipping-rates-cell-actions";

export const columns: ColumnDef<AdminStoreType>[] = [
  {
    accessorKey: "cover",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="relative h-44 min-w-64 rounded-xl overflow-hidden">
          <Image
            src={row.original.cover}
            alt=""
            width={500}
            height={300}
            className="w-96 h-40 rounded-md object-cover shadow-sm"
          />
          <Image
            src={row.original.logo}
            alt=""
            width={200}
            height={200}
            className="w-24 h-24 rounded-full object-cover shadow-2xl absolute top-1/2 -translate-y-1/2 left-4"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.name}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <span className="text-sm line-clamp-3">{row.original.description}</span>
      );
    },
  },

  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      return <span>/{row.original.url}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <StoreStatusSelect
          storeId={row.original.id}
          status={row.original.status as StoreStatus}
        />
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground flex justify-center">
          {row.original.featured ? (
            <BadgeCheck className="stroke-green-300" />
          ) : (
            <BadgeMinus />
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "open",
    header: "",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { setOpen } = useModal();
      return (
        <div>
          <button
            className="font-sans flex justify-center gap-2 items-center mx-auto  text-lg text-gray-50 bg-[#0A0D2D] backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-primary hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            onClick={() => {
              setOpen(
                <CustomModal maxWidth="!max-w-3xl">
                  <StoreSummary store={row.original} />
                </CustomModal>
              );
            }}
          >
            View
            <span className="w-7 h-7 rounded-full bg-white grid  place-items-center">
              <Expand className="w-5 stroke-black" />
            </span>
          </button>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions storeId={rowData.id} />;
    },
  },
];
