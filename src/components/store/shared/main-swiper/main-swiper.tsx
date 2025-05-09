"use client";
import { FC, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

import { ProductType, SimpleProduct } from "@/types/product.types";

import ProductCard from "@/components/store/cards/product/product-card";
import ProductCardSimple from "@/components/store/cards/product/simple-card";
import ProductCardClean from "@/components/store/cards/product/clean-card";

interface Props {
  children?: ReactNode;
  products: SimpleProduct[] | ProductType[];
  type: "main" | "curved" | "simple";
  slidesPerView?: number;
  breakpoints?: {
    [key: number]: { slidesPerView: number };
  };
  spaceBetween?: number;
}

const MainSwiper: FC<Props> = ({
  products,
  type,
  breakpoints = {
    500: { slidesPerView: 2 },
    750: { slidesPerView: 3 },
    965: { slidesPerView: 4 },
    1200: { slidesPerView: 5 },
    1400: { slidesPerView: 6 },
  },
  children,
  slidesPerView = 1,
  spaceBetween = 30,
}) => {
  return (
    <div className="p-4 rounded-md cursor-pointer">
      <div>{children}</div>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        breakpoints={breakpoints}
      >
        {products.map((product, i) => (
          <SwiperSlide key={i}>
            {type === "simple" ? (
              <ProductCardSimple product={product as SimpleProduct} />
            ) : type === "curved" ? (
              <ProductCardClean product={product as ProductType} />
            ) : (
              <ProductCard product={product as ProductType} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MainSwiper;
