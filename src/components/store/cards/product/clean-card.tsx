import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ProductType, VariantSimplified } from "@/types/product.types";
import StarRatings from "react-star-ratings";

export default function ProductCardClean({
  product,
}: {
  product: ProductType;
}) {
  const [variant, setVariant] = useState<VariantSimplified>(
    product.variants[0]
  );

  const size = variant.sizes.reduce((lowest, current) => {
    const currentPriceAfterDiscount =
      current.price * (1 - current.discount / 100);
    const lowestPriceAfterDiscount = lowest.price * (1 - lowest.discount / 100);

    return currentPriceAfterDiscount < lowestPriceAfterDiscount
      ? current
      : lowest;
  });
  const numReviews = new Intl.NumberFormat().format(product.numReviews);

  return (
    <Link href={`/product/${product.slug}/${variant.variantSlug}`}>
      <div className="card">
        <div className="image-container">
          <Image src={variant.images[0].url} alt="" width={300} height={300} />
          <div className="price">${size.price}</div>
        </div>
        <div className="content">
          <div className="brand line-clamp-1">{variant.variantName}</div>
          <div className="product-name line-clamp-1">{product.name}</div>
          <div className="color-size-container">
            <div className="">
              <ul className="flex items-center gap-x-0.5">
                {product.variantImages.map((img, i) => (
                  <li
                    key={`img-${i}`}
                    className=""
                    onMouseEnter={() => setVariant(product.variants[i])}
                  >
                    <Image
                      src={img.image}
                      alt=""
                      width={50}
                      height={50}
                      className="w-6 h-6 object-cover rounded-full"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rating h-4">
            <StarRatings
              rating={product.rating}
              starRatedColor="#FFD804"
              starEmptyColor="#F5F5F5"
              numberOfStars={5}
              starDimension="19px"
              starSpacing="2px"
            />
            ({numReviews})
          </div>
        </div>
      </div>
    </Link>
  );
}
