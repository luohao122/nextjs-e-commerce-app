"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CountryWithShippingRatesType } from "@/components/dashboard/forms/store-shipping-rates-table/store-shipping-rates-columns/store-shipping-rates-columns.types";
import StoreShippingRatesCellActions from "@/components/dashboard/forms/store-shipping-rates-table/store-shipping-rates-columns/store-shipping-rates-cell-actions";

/**
 * Column definitions for the Store Shipping Rates table.
 *
 * This array defines the columns that will be rendered in the shipping rates table.
 * Each column specifies how its header and cells should be displayed.
 *
 * @type {ColumnDef<CountryWithShippingRatesType>[]}
 */
export const columns: ColumnDef<CountryWithShippingRatesType>[] = [
  {
    accessorKey: "countryName",
    header: "Country",
    cell: ({ row }) => {
      return <span>{row.original.countryName}</span>;
    },
  },
  {
    accessorKey: "shippingService",
    header: "Shipping service",
    cell: ({ row }) => {
      return (
        <span>{row.original.shippingRate?.shippingService || "Default"}</span>
      );
    },
  },
  {
    accessorKey: "shippingFeePerItem",
    header: "Shipping Fee per item",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeePerItem;
      return (
        <span>{value === 0 ? "Free" : value > 0 ? value : "Default"}</span>
      );
    },
  },
  {
    accessorKey: "shippingFeeForAdditionalItem",
    header: "Shipping Fee for additional item",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeeForAdditionalItem;

      return (
        <span>
          <span>{value === 0 ? "Free" : value > 0 ? value : "Default"}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeePerKg",
    header: "Shipping Fee per Kg",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeePerKg;

      return (
        <span>
          <span>{value === 0 ? "Free" : value > 0 ? value : "Default"}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeeFixed",
    header: "Shipping Fee fixed",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeeFixed;

      return (
        <span>
          <span>{value === 0 ? "Free" : value > 0 ? value : "Default"}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryTimeMin",
    header: "Delivery min days",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.deliveryTimeMin
            ? `${row.original.shippingRate?.deliveryTimeMin}`
            : "Default"}
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryTimeMax",
    header: "Delivery max days",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.deliveryTimeMax
            ? `${row.original.shippingRate?.deliveryTimeMax}`
            : "Default"}
        </span>
      );
    },
  },
  {
    accessorKey: "returnPolicy",
    header: "Return policy",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.returnPolicy
            ? `${row.original.shippingRate?.returnPolicy}`
            : "Default"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <StoreShippingRatesCellActions rowData={rowData} />;
    },
  },
];
