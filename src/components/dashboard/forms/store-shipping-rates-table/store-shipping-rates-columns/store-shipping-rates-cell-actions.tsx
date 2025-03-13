"use client";

import { Edit, MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog } from "@/components/ui/alert-dialog";
import CustomModal from "@/components/dashboard/shared/custom-modal/custom-modal";

import { Button } from "@/components/ui/button";
import { useModal } from "@/contexts/modal-provider";
import { CellActionsProps } from "@/components/dashboard/forms/store-shipping-rates-table/store-shipping-rates-columns/store-shipping-rates-columns.types";

import ShippingRateDetails from "@/components/dashboard/forms/shipping-rate-details/shipping-rate-details";

const StoreShippingRatesCellActions: React.FC<CellActionsProps> = ({
  rowData,
}) => {
  // Hooks
  const { setOpen } = useModal();
  const params = useParams<{ storeUrl: string }>();

  // Return null if rowData or rowData.id don't exist
  if (!rowData) return null;

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
                  <ShippingRateDetails
                    data={rowData}
                    storeUrl={params.storeUrl}
                  />
                </CustomModal>
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </AlertDialog>
  );
};

export default StoreShippingRatesCellActions;
