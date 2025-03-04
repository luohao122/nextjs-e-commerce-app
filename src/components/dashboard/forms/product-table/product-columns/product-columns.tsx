"use client";

import Image from "next/image";
import { CopyPlus, FilePenLine } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";

import CategoryCellActions from "@/components/dashboard/forms/category-table/category-columns/category-cell-actions";
import { StoreProduct } from "@/components/dashboard/forms/product-table/product-columns/product-columns.types";

/**
 * Column definitions for the Product table.
 *
 * This array defines the columns that will be rendered in the product table.
 * Each column specifies how its header and cells should be displayed.
 *
 * @type {ColumnDef<StoreProduct>[]}
 */
export const columns: ColumnDef<StoreProduct>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-3">
          <h1 className="font-bold truncate pb-3 border-b capitalize">
            {row.original.name}
          </h1>
          <div className="relative flex flex-wrap gap-2">
            {row.original.variants.map((variant) => (
              <div key={variant.id} className="flex flex-col gap-y-2 group">
                <div className="relative cursor-pointer">
                  <Image
                    src={variant.images[0].url}
                    alt={variant.variantName}
                    width={1000}
                    height={1000}
                    className="min-w-72 max-w-72 h-80 rounded-sm object-cover shadow-2xl"
                  />
                  <Link
                    href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/${variant.id}`}
                  >
                    <div className="w-full h-full absolute top-0 left-0 bottom-0 right-0 z-0 rounded-sm bg-black/50 transition-all duration-150 hidden group-hover:block">
                      <FilePenLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                  </Link>
                  <div className="flex mt-2 gap-2">
                    <div className="w-7 flex flex-col gap-2 rounded-md">
                      {variant.colors.map((color) => (
                        <span
                          key={color.name}
                          className="w-5 h-5 rounded-full shadow-2xl"
                          style={{ backgroundColor: color.name }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <span>{row.original.category.name}</span>;
    },
  },

  {
    accessorKey: "subCategory",
    header: "SubCategory",
    cell: ({ row }) => {
      return <span>/{row.original.subCategory.name}</span>;
    },
  },
  {
    accessorKey: "new-variant",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/new`}
        >
          <CopyPlus className="hover:text-blue-200" />
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Render the action buttons (edit/delete) using the CategoryCellActions component.
      const rowData = row.original;
      return <CategoryCellActions rowData={rowData} />;
    },
  },
];
