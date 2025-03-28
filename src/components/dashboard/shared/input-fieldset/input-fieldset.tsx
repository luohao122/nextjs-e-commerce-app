import { Dot } from "lucide-react";

import { InputFielsetProps } from "@/components/dashboard/shared/input-fieldset/input-fieldset.types";
import { FormLabel } from "@/components/ui/form";

export default function InputFieldset({
  label,
  description,
  children,
}: InputFielsetProps) {
  return (
    <div>
      <fieldset className="border rounded-md p-4">
        <legend className="px-2">
          <FormLabel>{label}</FormLabel>
        </legend>
        {description && (
          <p className="text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
            <Dot className="-me-1" />
            {description}
          </p>
        )}
        {children}
      </fieldset>
    </div>
  );
}
