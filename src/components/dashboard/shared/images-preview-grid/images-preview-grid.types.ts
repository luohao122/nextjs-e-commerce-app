import { Dispatch, SetStateAction } from "react";

export interface ImagesPreviewGridProps {
  images: { url: string }[];
  onRemove: (value: string) => void;
  colors?: { color: string }[];
  setColors?: Dispatch<SetStateAction<{ color: string }[]>>;
}
