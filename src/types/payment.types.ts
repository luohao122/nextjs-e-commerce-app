import { Prisma } from "@prisma/client";

import { getUserPayments } from "@/queries/profile.query";

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Declined = "Declined",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
  PartiallyRefunded = "PartiallyRefunded",
  Chargeback = "Chargeback",
}

export type PaymentTableFilter = "" | "paypal" | "credit-card";

export type PaymentTableDateFilter =
  | ""
  | "last-6-months"
  | "last-1-year"
  | "last-2-years";

export type UserPaymentType = Prisma.PromiseReturnType<
  typeof getUserPayments
>["payments"][0];
