import { Category } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

export interface CategoriesMenuProps {
  categories: Category[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
