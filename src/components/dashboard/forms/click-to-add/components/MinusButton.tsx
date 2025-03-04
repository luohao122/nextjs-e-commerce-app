import { FC } from "react";

import { MinusButtonProps } from "@/components/dashboard/forms/click-to-add/components/MinusButton.types";

const MinusButton: FC<MinusButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      title="Remove detail"
      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
      onClick={onClick}
    >
      {/* Minus icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 24 24"
        className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-white group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300"
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          strokeWidth="1.5"
        />
        <path d="M8 12H16" strokeWidth="1.5" />
      </svg>
    </button>
  );
};

export default MinusButton;
