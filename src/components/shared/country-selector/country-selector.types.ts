import { SelectMenuOption } from "@/types/types";

export interface CountrySelectorProps {
  id: string;
  open: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onChange: (value: SelectMenuOption["name"]) => void;
  selectedValue: SelectMenuOption;
}
