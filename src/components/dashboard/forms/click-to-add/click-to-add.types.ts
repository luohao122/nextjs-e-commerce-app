import { Dispatch, SetStateAction } from "react";

// Sample structure of the Detail object:
// { quantity: 1 } or { size: "xl" }

// Define the interface for each detail object
export interface Detail<T = { [key: string]: string | number | undefined }> {
  [key: string]: T[keyof T];
}

export interface ClickToAddInputsProps<T extends Detail> {
  details: T[];
  setDetails: Dispatch<SetStateAction<T[]>>;
  initialDetail?: T;
  header?: string;
  colorPicker?: boolean;
  containerClassName?: string;
  inputClassName?: string;
}
