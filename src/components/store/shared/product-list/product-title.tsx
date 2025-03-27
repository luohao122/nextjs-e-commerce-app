import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface ProductTitleProps {
  title?: string;
  link?: string;
  arrow?: boolean;
}

const ProductTitle: FC<ProductTitleProps> = ({ title, link, arrow }) => {
  const Title = link ? (
    <Link href={link} className="h-12">
      <h2 className="text-main-primary text-xl font-bold">
        {title}&nbsp;
        {arrow ? <ChevronRight className="w-3 inline-block" /> : <></>}
      </h2>
    </Link>
  ) : (
    <h2 className="text-main-primary text-xl font-bold">
      {title}&nbsp;
      {arrow ? <ChevronRight className="w-3 inline-block" /> : <></>}
    </h2>
  );

  return Title;
};

export default ProductTitle;
