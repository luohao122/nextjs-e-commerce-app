import { FC } from "react";

import { cn } from "@/lib/utils";
import { Spec } from "@/components/store/product-page/product-specs/product-specs";

interface SpecTableProps {
  data: Spec[];
  noTopBorder?: boolean;
}

const SpecTable: FC<SpecTableProps> = ({ data, noTopBorder }) => {
  return (
    <ul
      className={cn("border grid grid-cols-2", {
        "border-t-0": noTopBorder,
      })}
    >
      {data.map((spec, i) => (
        <li
          className={cn("flex border-t", {
            "border-t-0": i === 0,
          })}
          key={i}
        >
          <div className="float-left text-sm leading-7 max-w-[50%] relative w-1/2 flex">
            <div className="p-4 bg-[#f5f5f5] text-main-primary w-44">
              <span className="leading-5">{spec.name}</span>
            </div>
            <div className="p-4 text-[#151515] flex-1 break-words leading-5">
              <span className="leading-5">{spec.value}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SpecTable;
