import { PaymentDetails } from "@prisma/client";

export interface OrderInfoCardProps {
  totalItemsCount: number;
  deliveredItemsCount: number;
  paymentDetails: PaymentDetails | null;
}