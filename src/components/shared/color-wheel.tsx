import { FC } from "react";
import { Color } from "@prisma/client";

type ColorWheelProps = {
  colors: Partial<Color>[];
  size: number;
};

const ColorWheel: FC<ColorWheelProps> = ({ colors, size }) => {
  const numColors = colors.length;
  const radius = size / 2;

  if (numColors === 1) {
    // Render a full circle if only one color is provided.
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shadow-sm rounded-full">
        <circle cx={radius} cy={radius} r={radius} fill={colors[0].name} stroke="white" strokeWidth="1" />
      </svg>
    );
  }

  const sliceAngle = 360 / numColors;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shadow-sm rounded-full">
      {colors.map((color, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        const startRadians = (startAngle * Math.PI) / 180;
        const endRadians = (endAngle * Math.PI) / 180;

        const x1 = radius + radius * Math.cos(startRadians);
        const y1 = radius + radius * Math.sin(startRadians);
        const x2 = radius + radius * Math.cos(endRadians);
        const y2 = radius + radius * Math.sin(endRadians);

        const largeArcFlag = sliceAngle > 180 ? 1 : 0;
        const pathData = `
          M ${radius},${radius}
          L ${x1},${y1}
          A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}
          Z
        `;

        return (
          <path
            key={index}
            d={pathData}
            fill={color.name}
            stroke="white"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
};

export default ColorWheel;
