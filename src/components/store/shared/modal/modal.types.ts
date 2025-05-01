import { Dispatch, ReactNode, SetStateAction } from "react";

export interface ModalProps {
  title?: string;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}
