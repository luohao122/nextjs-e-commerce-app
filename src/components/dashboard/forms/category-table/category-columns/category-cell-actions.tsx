"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import CategoryDetails from "@/components/dashboard/forms/category-details/category-details";
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

import { getCategory, deleteCategory } from "@/queries/category.query";
import { useToast } from "@/hooks/use-toast";
import { CLOUDINARY_PRESET } from "@/config/constants";

import { CellActionsProps } from "@/components/dashboard/forms/category-table/category-columns/category-columns.types";

/**
 * CategoryCellActions Component
 *
 * Provides action buttons for a category row, including editing and deleting actions.
 * - When "Edit Details" is clicked, a modal is opened with the CategoryDetails component,
 *   which displays and optionally fetches the latest category data.
 * - When "Delete category" is clicked, a confirmation dialog is shown, and upon confirmation,
 *   the category is deleted.
 *
 * @component
 * @param {CellActionsProps} props - The properties for the component.
 * @param {Category} props.rowData - The category data for the current row.
 * @returns {JSX.Element|null} The rendered action cell or null if rowData or its id is not available.
 *
 * @example
 * <CategoryCellActions rowData={category} />
 */
const CategoryCellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  // Retrieve modal control functions from the modal context.
  const { setOpen, setClose } = useModal();
  // Local loading state for delete operation.
  const [loading, setLoading] = useState(false);
  // Toast hook to display notifications.
  const { toast } = useToast();
  // Next.js router for navigation and refresh.
  const router = useRouter();

  // Return null if no row data or category id is provided.
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
                  <CategoryDetails
                    cloudinaryKey={CLOUDINARY_PRESET}
                    data={{ ...rowData }}
                  />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getCategory(rowData?.id),
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
              <Trash size={15} /> Delete category
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
            category and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteCategory(rowData.id);
              toast({
                title: "Deleted category",
                description: "The category has been deleted.",
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

export default CategoryCellActions;
