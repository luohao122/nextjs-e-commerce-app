import { useEffect, useRef } from "react";
import Image from "next/image";
import { ProductVariantImage } from "@prisma/client";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function ProductCardImageSwiper({
  images,
}: {
  images: ProductVariantImage[];
}) {
  const swiperRef = useRef<SwiperRef | null>(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  }, [swiperRef]);

  return (
    <div
      onMouseLeave={() => {
        if (swiperRef.current) {
          swiperRef.current.swiper.autoplay.stop();
          swiperRef.current.swiper.slideTo(0);
        }
      }}
      onMouseEnter={() => {
        if (swiperRef.current) {
          swiperRef.current.swiper.autoplay.start();
        }
      }}
      className="relative mb-2 w-full h-[200px] bg-white contrast-[90%] rounded-2xl overflow-hidden"
    >
      <Swiper ref={swiperRef} modules={[Autoplay]} autoplay={{ delay: 500 }}>
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <Image
              src={image.url}
              alt={image.alt}
              width={400}
              height={400}
              className="block object-cover h-[200px] w-48 sm:w-52"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
