import NewsLetter from "@/components/store/layout/footer/newsletter";
import Contact from "@/components/store/layout/footer/contact";
import FooterLinks from "@/components/store/layout/footer/footer-links";

import { getSubCategories } from "@/queries/sub-category.query";

export default async function Footer() {
  const subcategories = await getSubCategories(7, true);

  return (
    <div className="w-full bg-white">
      <NewsLetter />
      <div className="max-w-[1430px] mx-auto">
        <div className="p-5">
          <div className="grid md:grid-cols-2 md:gap-x-5">
            <Contact />
            <FooterLinks subcategories={subcategories} />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-cyan-950 to-cyan-950 px-2 text-white">
        <div className="max-w-[1430px] mx-auto flex items-center h-7">
          <span className="text-sm">
            <strong>&copy; MarketHub</strong> - All Rights Reserved
          </span>
        </div>
      </div>
    </div>
  );
}
