import StoreDetails from "@/components/dashboard/forms/store-details/store-details";
import { CLOUDINARY_PRESET } from "@/config/constants";

export default function SellerNewStorePage() {
  return (
    <div className="p-2">
      <StoreDetails cloudinaryKey={CLOUDINARY_PRESET} />
    </div>
  );
}
