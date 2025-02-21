/**
 * Props for the CustomModal component.
 *
 * @typedef {Object} Props
 * @property {string} [heading] - Optional heading text to be displayed at the top of the modal.
 * @property {string} [subheading] - Optional subheading text displayed below the heading.
 * @property {React.ReactNode} children - The content of the modal.
 * @property {boolean} [defaultOpen] - Optional flag to set the modal as open by default.
 * @property {string} [maxWidth] - Optional max-width CSS class for the modal content.
 */
export type CustomModalProps = {
  heading?: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  maxWidth?: string;
};

