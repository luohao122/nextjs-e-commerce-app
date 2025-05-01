"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Coupon } from "@prisma/client";
import { getTimeUntil } from "@/lib/utils";
import CellActions from "@/components/dashboard/forms/coupon-table/coupon-cell-actions";

export const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      return <span>{row.original.code}</span>;
    },
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      return <span>{row.original.discount}</span>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Starts",
    cell: ({ row }) => {
      return <span>{new Date(row.original.startDate).toDateString()}</span>;
    },
  },
  {
    accessorKey: "endDate",
    header: "Ends",
    cell: ({ row }) => {
      return <span>{new Date(row.original.endDate).toDateString()}</span>;
    },
  },
  {
    accessorKey: "timeLeft",
    header: "Time Left",
    cell: ({ row }) => {
      const { days, hours } = getTimeUntil(row.original.endDate);
      return (
        <span>
          {days} days and {hours} hours
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions coupon={rowData} />;
    },
  },
];