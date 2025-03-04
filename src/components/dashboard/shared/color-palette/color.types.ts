import { Dispatch, SetStateAction } from "react";

export interface ColorProps {
  color: string;
  setActiveColor: Dispatch<SetStateAction<string>>;
  handleAddColor: (color: string) => void;
}
