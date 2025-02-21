"use client";

import Image from "next/image";
import { Category } from "@prisma/client";
import { BadgeCheck, BadgeMinus } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";

import CategoryCellActions from "@/components/dashboard/forms/category-table/category-columns/category-cell-actions";

/**
 * Column definitions for the Category table.
 *
 * This array defines the columns that will be rendered in the category table.
 * Each column specifies how its header and cells should be displayed.
 *
 * @type {ColumnDef<Category>[]}
 */
export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      // Render the category's image inside a rounded container with overflow hidden.
      return (
        <div className="relative h-44 min-w-64 rounded-xl overflow-hidden">
          <Image
            src={row.original.image}
            alt=""
            width={1000}
            height={1000}
            className="w-40 h-40 rounded-full object-cover shadow-2xl"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      // Render the category name with bold and capitalized styling.
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.name}
        </span>
      );
    },
  },

  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      // Render the category URL with a preceding slash.
      return <span>/{row.original.url}</span>;
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      // Display an icon indicating whether the category is featured:
      // BadgeCheck for featured; BadgeMinus for not featured.
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
    id: "actions",
    cell: ({ row }) => {
      // Render the action buttons (edit/delete) using the CategoryCellActions component.
      const rowData = row.original;
      return <CategoryCellActions rowData={rowData} />;
    },
  },
];
