import { Color } from "@prisma/client";

export type ColorWheelProps = {
  colors: Partial<Color>[];
  size: number;
};
