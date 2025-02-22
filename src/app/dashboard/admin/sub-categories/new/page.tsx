import SubCategoryDetails from "@/components/dashboard/forms/sub-category-details/sub-category-details";
import { CLOUDINARY_PRESET } from "@/config/constants";
import { getAllCategories } from "@/queries/category.query";

export default async function AdminNewSubCategoryPage() {
  const categories = await getAllCategories();

  return (
    <SubCategoryDetails
      cloudinaryKey={CLOUDINARY_PRESET}
      categories={categories}
    />
  );
}
