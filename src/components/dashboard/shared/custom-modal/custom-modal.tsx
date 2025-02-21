"use client";

import { useModal } from "@/contexts/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { CustomModalProps } from "@/components/dashboard/shared/custom-modal/custom-modal.types";

/**
 * CustomModal Component
 *
 * A reusable modal component that utilizes the modal context for managing open/close state.
 * It displays a dialog with an optional heading and subheading, along with the passed children.
 * The modal is controlled by the modal context via `isOpen` and `setClose`.
 *
 * @param {Props} props - The properties for the CustomModal.
 * @returns {JSX.Element} The rendered modal component.
 */
const CustomModal = ({
  children,
  defaultOpen,
  subheading,
  heading,
  maxWidth,
}: CustomModalProps) => {
  // Retrieve the modal state and close handler from the modal context.
  const { isOpen, setClose } = useModal();

  return (
    // Render the Dialog component. The modal is open if the context indicates it or if defaultOpen is true.
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent
        className={cn(
          "overflow-y-scroll md:max-h-[700px] md:h-fit h-screen bg-card",
          maxWidth
        )}
      >
        <DialogHeader className="pt-8 text-left">
          {heading && (
            <DialogTitle className="text-2xl font-bold">{heading}</DialogTitle>
          )}
          {subheading && <DialogDescription>{subheading}</DialogDescription>}
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
