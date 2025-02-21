"use client";

import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FilePlus2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/dashboard/shared/custom-modal/custom-modal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/contexts/modal-provider";

/**
 * Props for the DataTable component.
 *
 * @template TData - The type of data rows.
 * @template TValue - The type of cell values.
 *
 * @typedef {Object} DataTableProps
 * @property {ColumnDef<TData, TValue>[]} columns - Column definitions for the table.
 * @property {TData[]} data - Array of data rows to display.
 * @property {string} filterValue - The key for the column to filter on.
 * @property {React.ReactNode} [actionButtonText] - Optional text or element for the action button.
 * @property {React.ReactNode} [modalChildren] - Optional modal content to display when the action button is clicked.
 * @property {string} [newTabLink] - Optional link for opening a new page.
 * @property {string} searchPlaceholder - Placeholder text for the search input.
 * @property {string} [heading] - Optional heading to pass into the modal.
 * @property {string} [subheading] - Optional subheading to pass into the modal.
 * @property {true} [noHeader] - If true, the table header will not be rendered.
 */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
  newTabLink?: string;
  searchPlaceholder: string;
  heading?: string;
  subheading?: string;
  noHeader?: true;
}

/**
 * DataTable Component
 *
 * A reusable table component that supports filtering, custom modals for actions,
 * and optional navigation to a new page. This component uses Tanstack React Table for
 * table state management and rendering.
 *
 * @template TData - The type of data rows.
 * @template TValue - The type of cell values.
 *
 * @param {DataTableProps<TData, TValue>} props - The props for the component.
 * @returns {JSX.Element} The rendered table component.
 */
export default function DataTable<TData, TValue>({
  columns,
  data,
  filterValue,
  modalChildren,
  actionButtonText,
  searchPlaceholder,
  heading,
  subheading,
  noHeader,
  newTabLink,
}: DataTableProps<TData, TValue>) {
  // Get the setOpen function from the modal context to open modals when needed.
  const { setOpen } = useModal();

  // Create a React Table instance using Tanstack's useReactTable hook.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      {/* Header section with search input and action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center py-4 gap-2">
          <Search />
          <Input
            placeholder={searchPlaceholder}
            value={
              // Get current filter value from the table state
              (table.getColumn(filterValue)?.getFilterValue() as string) ?? ""
            }
            // Update the filter value based on input changes
            onChange={(event) =>
              table.getColumn(filterValue)?.setFilterValue(event.target.value)
            }
            className="h-12"
          />
        </div>
        {/* Action Buttons: Open modal or navigate to new page */}
        <div className="flex gap-x-2">
          {modalChildren && (
            <Button
              className="flex- gap-2"
              onClick={() => {
                // When action button is clicked, open the modal with provided content.
                if (modalChildren)
                  setOpen(
                    <CustomModal
                      heading={heading || ""}
                      subheading={subheading || ""}
                    >
                      {modalChildren}
                    </CustomModal>
                  );
              }}
            >
              {actionButtonText}
            </Button>
          )}
          {newTabLink && (
            <Link href={newTabLink}>
              <Button variant="outline">
                <FilePlus2 className="me-1" /> Create in new page
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className=" border bg-background rounded-lg">
        <Table className="">
          {/* Render Table Header if noHeader is not true */}
          {!noHeader && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}

          {/* Table body */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="max-w-[400px] break-words"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              // Display a "No Results" message if there are no rows.
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
