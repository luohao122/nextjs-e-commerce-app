// Sample structure of the Detail object:

import { Dispatch, SetStateAction } from "react";

// { quantity: 1 } or { size: "xl" }
export interface Detail {
  [key: string]: string | number | boolean | undefined;
}

export interface ClickToAddInputsProps<T extends Detail> {
  details: T[];
  setDetails: Dispatch<SetStateAction<T[]>>;
  initialDetail?: T;
  header?: string;
  colorPicker?: boolean;
}
