// Sample structure of the Detail object:

import { Dispatch, SetStateAction } from "react";

// { quantity: 1 } or { size: "xl" }
export interface Detail {
  [key: string]: string | number | boolean | undefined;
}

export interface ClickToAddInputsProps {
  details: Detail[];
  setDetails: Dispatch<SetStateAction<Detail[]>>;
  initialDetail?: Detail;
  header: string;
  colorPicker?: boolean;
}
