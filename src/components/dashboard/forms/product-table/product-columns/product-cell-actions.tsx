"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

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

import { useModal } from "@/contexts/modal-provider";
import { useToast } from "@/hooks/use-toast";
import { CellActionsProps } from "@/components/dashboard/forms/product-table/product-columns/product-columns.types";

import { deleteProduct } from "@/queries/product.query";

/**
 * ProductCellActions Component
 *
 * Provides action buttons for a product row, including editing and deleting actions.
 * - When "Delete product" is clicked, a confirmation dialog is shown, and upon confirmation,
 *   the product is deleted.
 *
 * @component
 * @param {CellActionsProps} props - The properties for the component.
 * @param {string} props.productId - The product id for the current row.
 * @returns {JSX.Element|null} The rendered action cell or null if productId is not available.
 *
 * @example
 * <ProductCellActions productId={product.id} />
 */
const ProductCellActions: React.FC<CellActionsProps> = ({ productId }) => {
  // Retrieve modal control functions from the modal context.
  const { setClose } = useModal();
  // Local loading state for delete operation.
  const [loading, setLoading] = useState(false);
  // Toast hook to display notifications.
  const { toast } = useToast();
  // Next.js router for navigation and refresh.
  const router = useRouter();

  // Return null if no row data or product id is provided.
  if (!productId) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div>
          <Trash size={15} onClick={() => {}} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            product and variants related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteProduct(productId);
              toast({
                title: "Deleted product",
                description: "The product has been deleted.",
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

export default ProductCellActions;
