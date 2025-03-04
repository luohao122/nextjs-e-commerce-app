import { Dispatch, SetStateAction } from "react";

export interface ColorPaletteProps {
  extractedColors: string[]; // Extracted colors
  colors?: { color: string }[];
  setColors?: Dispatch<SetStateAction<{ color: string }[]>>;
}
