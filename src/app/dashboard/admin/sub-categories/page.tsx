import { Plus } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import { CLOUDINARY_PRESET } from "@/config/constants";
import { getAllSubCategories } from "@/queries/sub-category.query";

import SubCategoryDetails from "@/components/dashboard/forms/sub-category-details/sub-category-details";
import { getAllCategories } from "@/queries/category.query";
import { columns } from "@/components/dashboard/forms/sub-category-table/sub-category-columns/sub-category-columns";

export default async function AdminSubCategoriesPage() {
  const subCategories = await getAllSubCategories()
  const categories = await getAllCategories()

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create SubCategory
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories} cloudinaryKey={CLOUDINARY_PRESET} />}
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search sub-category name..."
      columns={columns}
      newTabLink="/dashboard/admin/sub-categories/new"
    />
  );
}
