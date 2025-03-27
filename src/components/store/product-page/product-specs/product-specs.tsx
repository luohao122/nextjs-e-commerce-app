import { FC } from "react";
import SpecTable from "./spec-table";

export interface Spec {
  name: string;
  value: string;
}

interface ProductSpecsProps {
  specs: {
    product: Spec[];
    variant: Spec[];
  };
}

const ProductSpecs: FC<ProductSpecsProps> = ({ specs }) => {
  const { product, variant } = specs;

  return (
    <div className="pt-6">
      <div className="h-12">
        <h2 className="text-main-primary text-2xl font-bold">Specifications</h2>
      </div>
      <SpecTable data={product} />
      <SpecTable data={variant} noTopBorder />
    </div>
  );
};

export default ProductSpecs;
