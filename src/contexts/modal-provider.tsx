"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@prisma/client";

/**
 * Props for the ModalProvider component.
 *
 * @typedef {Object} ModalProviderProps
 * @property {React.ReactNode} children - The child components that will have access to the modal context.
 */
interface ModalProviderProps {
  children: React.ReactNode;
}

/**
 * Data that can be passed into the modal.
 *
 * @typedef {Object} ModalData
 * @property {User} [user] - An optional user object from Prisma.
 */
export type ModalData = {
  user?: User;
};

/**
 * The shape of the modal context.
 *
 * @typedef {Object} ModalContextType
 * @property {ModalData} data - Data to be passed to the modal.
 * @property {boolean} isOpen - Flag indicating if the modal is open.
 * @property {(modal: React.ReactNode, fetchData?: () => Promise<any>) => void} setOpen - Function to open the modal with optional data fetching.
 * @property {() => void} setClose - Function to close the modal.
 */
type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  // Opens the modal and optionally fetches additional data.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  // Closes the modal.
  setClose: () => void;
};

/**
 * The ModalContext provides a way to open/close modals and pass data to them.
 */
export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  // Dummy function for setOpen, will be overridden by ModalProvider.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  setOpen: (_modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  // Dummy function for setClose.
  setClose: () => {},
});

/**
 * ModalProvider component that wraps the application (or part of it) and provides modal context.
 *
 * This provider maintains state for whether a modal is open, what modal content to display,
 * and any data that should be passed into the modal. It also provides functions to open and close
 * the modal.
 *
 * @component
 * @param {ModalProviderProps} props - The properties passed to the ModalProvider.
 * @returns {JSX.Element|null} The ModalProvider component with context and children.
 */
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // State for whether the modal is open
  const [isOpen, setIsOpen] = useState(false);
  // State for any additional modal data (e.g., a User)
  const [data, setData] = useState<ModalData>({});
  // State for the React node representing the modal content to display
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  // State to determine if the component is mounted on the client side
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after the component mounts to ensure client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Opens the modal.
   *
   * This function accepts a React node to be used as the modal content and an optional
   * fetchData function to load any additional data required by the modal. If fetchData is provided,
   * its result is merged into the modal's data state.
   *
   * @param {React.ReactNode} modal - The modal content to display.
   * @param {() => Promise<any>} [fetchData] - Optional function to fetch additional data.
   */
  const setOpen = async (
    modal: React.ReactNode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      // If a data-fetching function is provided, execute it and update the modal data.
      if (fetchData) {
        const fetchedData = await fetchData();
        setData({ ...data, ...(fetchedData || {}) });
      }
      // Set the modal content and mark the modal as open.
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  /**
   * Closes the modal.
   *
   * Resets the modal open state and clears any modal data.
   */
  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  // Prevent rendering on the server side until after mounting.
  if (!isMounted) return null;

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

/**
 * Custom hook to access the modal context.
 *
 * This hook throws an error if used outside of a ModalProvider.
 *
 * @returns {ModalContextType} The modal context value.
 * @throws {Error} If the hook is used outside a ModalProvider.
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

export default ModalProvider;
