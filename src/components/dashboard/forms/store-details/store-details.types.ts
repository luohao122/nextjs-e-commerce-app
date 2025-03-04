import { Store } from "@prisma/client";

export interface StoreDetailsProps {
  data?: Store;
  cloudinaryKey: string;
  showBackToStoresButton?: boolean;
}
