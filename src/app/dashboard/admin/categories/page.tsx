import { Plus } from "lucide-react";

import CategoryDetails from "@/components/dashboard/forms/category-details/category-details";
import DataTable from "@/components/ui/data-table";
import { CLOUDINARY_PRESET } from "@/config/constants";

import { getAllCategories } from "@/queries/category.query";
import { columns } from "@/components/dashboard/forms/category-table/category-columns/category-columns";

export default async function AdminCategoryPage() {
  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
      modalChildren={<CategoryDetails cloudinaryKey={CLOUDINARY_PRESET} />}
      filterValue="name"
      data={categories}
      searchPlaceholder="Search category name..."
      columns={columns}
      newTabLink="/dashboard/admin/categories/new"
    />
  );
}
