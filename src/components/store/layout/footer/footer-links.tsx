import { footer_links } from "@/config/footer-links";
import { SubCategory } from "@prisma/client";
import Link from "next/link";

export default function FooterLinks({
  subcategories,
}: {
  subcategories: SubCategory[];
}) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
      <div className="space-y-4">
        <h1 className="text-lg font-bold">Choose your Favorite</h1>
        <ul className="flex flex-col gap-y-1">
          {subcategories.map((sub) => (
            <li key={sub.id}>
              <Link href={`/browse?subCategory=${sub.url}`}>
                <span className="capitalize">{sub.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4 md:mt-10">
        <ul className="flex flex-col gap-y-1">
          {footer_links.slice(0, 6).map((link) => (
            <li key={link.title}>
              <Link href={link.link}>
                <span>{link.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Customer care</h1>
        <ul className="flex flex-col gap-y-1">
          {footer_links.slice(6).map((link) => (
            <li key={link.title}>
              <Link href={link.link}>
                <span>{link.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
