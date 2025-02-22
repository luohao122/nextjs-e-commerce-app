"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import CustomModal from "@/components/dashboard/shared/custom-modal/custom-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/contexts/modal-provider";
import { useToast } from "@/hooks/use-toast";

import { CLOUDINARY_PRESET } from "@/config/constants";
import { CellActionsProps } from "@/components/dashboard/forms/sub-category-table/sub-category-columns/sub-category-columns.types";
import SubCategoryDetails from "@/components/dashboard/forms/sub-category-details/sub-category-details";

import {
  deleteSubCategory,
  getSubCategory,
} from "@/queries/sub-category.query";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/queries/category.query";

/**
 * SubCategoryCellActions Component
 *
 * Provides action buttons for a category row, including editing and deleting actions.
 * - When "Edit Details" is clicked, a modal is opened with the SubCategoryDetails component,
 *   which displays and optionally fetches the latest sub-category data.
 * - When "Delete sub-category" is clicked, a confirmation dialog is shown, and upon confirmation,
 *   the sub-category is deleted.
 *
 * @component
 * @param {SubCellActionsProps} props - The properties for the component.
 * @param {SubCategoryWithCategory} props.rowData - The sub-category data for the current row.
 * @returns {JSX.Element|null} The rendered action cell or null if rowData or its id is not available.
 *
 * @example
 * <SubCategoryCellActions rowData={category} />
 */
const SubCategoryCellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  // Retrieve modal control functions from the modal context.
  const { setOpen, setClose } = useModal();
  // Local loading state for delete operation.
  const [loading, setLoading] = useState(false);
  // Toast hook to display notifications.
  const { toast } = useToast();
  // Next.js router for navigation and refresh.
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  // Return null if no row data or sub-category id is provided.
  if (!rowData || !rowData.id) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                // Custom modal component
                <CustomModal>
                  {/* Store details component */}
                  <SubCategoryDetails
                    cloudinaryKey={CLOUDINARY_PRESET}
                    data={{ ...rowData }}
                    categories={categories}
                  />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getSubCategory(rowData?.id),
                  };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete sub-category
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            sub-category and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteSubCategory(rowData.id);
              toast({
                title: "Deleted sub-category",
                description: "The sub-category has been deleted.",
              });
              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubCategoryCellActions;
