import { FC } from "react";
import Image from "next/image";

import LogoImg from "../../../public/images/logo.png";

interface LogoProps {
  width: string;
  height: string;
}

const Logo: FC<LogoProps> = ({ width, height }) => {
  return (
    <div className="z-50" style={{ width, height }}>
      <Image
        src={LogoImg}
        alt="Market Hub"
        title="Market Hub"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
