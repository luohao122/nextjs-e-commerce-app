import { FC } from "react";

import { ColorProps } from "@/components/dashboard/shared/color-palette/color.types";

const Color: FC<ColorProps> = ({ color, setActiveColor, handleAddColor }) => {
  return (
    <div
      onClick={() => handleAddColor(color)}
      style={{ backgroundColor: color }}
      className="w-20 h-[80px] cursor-pointer transition-all duration-100 ease-linear relative hover:w-[120px] hover:duration-300"
      onMouseOver={() => setActiveColor(color)}
    >
      <div className="w-full h-8 text-center text-xs font-semibold absolute -top-6 text-black">
        {color}
      </div>
    </div>
  );
};

export default Color;
