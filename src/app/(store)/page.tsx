import ProductCard from "@/components/store/cards/product/product-card";
import FeaturedCategories from "@/components/store/home/featured-categories/featured-categories";

import Featured from "@/components/store/home/main/featured/featured";
import HomeMainSwiper from "@/components/store/home/main/home-swiper/home-swiper";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";

import Footer from "@/components/store/layout/footer/footer";
import Header from "@/components/store/layout/header/header";
import MainSwiper from "@/components/store/shared/main-swiper/main-swiper";

import {
  getHomeDataDynamic,
  getHomeFeaturedCategories,
} from "@/queries/home.query";
import { getProducts } from "@/queries/product.query";
import { SimpleProduct } from "@/types/product.types";

export default async function Home() {
  const productsData = await getProducts({}, "", 1, 100);
  const { products } = productsData;
  const featuredCategories = await getHomeFeaturedCategories();
  const { products_super_deals, products_featured } = await getHomeDataDynamic([
    { property: "offer", value: "best-deals", type: "simple" },
    { property: "offer", value: "super-deals", type: "full" },
    { property: "offer", value: "featured", type: "simple" },
  ]);

  return (
    <>
      <Header />
      <CategoriesHeader />
      <div className="relative w-full">
        <div className="relative w-[calc(100%)] h-full bg-[#e3e3e3]">
          <div className="max-w-[1600px] mx-auto min-h-screen p-4">
            {/* Main */}
            <div className="w-full grid gap-2">
              <div className="space-y-2 h-fit">
                {/* Main Slider */}
                <HomeMainSwiper />
                {/* Featured card */}
                <Featured
                  products={products_featured.filter(
                    (product): product is SimpleProduct =>
                      "variantSlug" in product
                  )}
                />
              </div>
            </div>
            <div className="mt-10 space-y-10">
              {products_super_deals.length > 0 && (
                <div className="bg-white rounded-md">
                  <MainSwiper products={products_super_deals} type="curved">
                    <div className="mb-4 pl-4 flex items-center justify-between">
                      SuperDeals
                    </div>
                  </MainSwiper>
                </div>
              )}
              <FeaturedCategories categories={featuredCategories} />
              <div>
                {/* Header */}
                <div className="text-center h-[32px] leading-[32px] text-[24px] font-extrabold text-[#222] flex justify-center">
                  <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
                  <span>More to love</span>
                  <div className="h-[1px] flex-1 border-t-[2px] border-t-[hsla(0,0%,59.2%,.3)] my-4 mx-[14px]" />
                </div>
                <div className="mt-7 bg-white justify-center flex flex-wrap min-[1530px]:grid min-[1530px]:grid-cols-7 p-4 pb-16 rounded-md">
                  {products.map((product, i) => (
                    <ProductCard key={i} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
