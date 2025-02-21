import CategoryDetails from "@/components/dashboard/forms/category-details/category-details";
import { CLOUDINARY_PRESET } from "@/config/constants";

export default function AdminNewCategoryPage() {
  return (
    <div className="w-full">
      <CategoryDetails cloudinaryKey={CLOUDINARY_PRESET} />
    </div>
  );
}
