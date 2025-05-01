import OrdersOverview from "@/components/store/profile/orders-overview/orders-overview";
import ProfileOverview from "@/components/store/profile/profile-overview/profile-overview";

export default function ProfilePage() {
  return (
    <div className="w-full space-y-4">
      <ProfileOverview />
      <OrdersOverview />
    </div>
  );
}
