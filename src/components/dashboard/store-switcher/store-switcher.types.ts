import React from "react";
import { PopoverTrigger } from "@/components/ui/popover";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

export interface StoreSwitcherProps extends PopoverTriggerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stores: Record<string, any>[];
}
