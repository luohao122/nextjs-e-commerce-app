import { getStoreDefaultShippingDetails } from "@/queries/store.query";
import { Prisma } from "@prisma/client";

export type StoreDefaultShippingType = Prisma.PromiseReturnType<
  typeof getStoreDefaultShippingDetails
>;

export interface StoreDefaultShippingDetailsProps {
  data?: StoreDefaultShippingType;
  storeUrl: string;
}
