import PaymentsTable from "@/components/store/profile/payment/payments-table/payments-table";
import { getUserPayments } from "@/queries/profile.query";

export default async function ProfilePaymentPage() {
  const payments_data = await getUserPayments();
  const { payments, totalPages } = payments_data;
  return (
    <div>
      <PaymentsTable payments={payments} totalPages={totalPages} />
    </div>
  );
}
