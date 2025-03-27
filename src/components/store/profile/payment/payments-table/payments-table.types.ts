import { UserPaymentType } from "@/types/payment.types";

export interface PaymentsTableProps {
  payments: UserPaymentType[];
  totalPages: number;
}
