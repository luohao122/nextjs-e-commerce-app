import { redirect } from "next/navigation";

import { getProductBySlug } from "@/queries/product.query";
import { ProductPageProps } from "./page.types";

export default async function ProductPage({ params }: ProductPageProps) {
  const productSlug = (await params).productSlug;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return redirect("/");
  }

  if (!product.variants.length) {
    return redirect("/");
  }

  return redirect(`/product/${product.slug}/${product.variants[0].slug}`);
}
