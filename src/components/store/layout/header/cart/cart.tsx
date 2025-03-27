import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Cart() {
  const totalItems = 5;

  return (
    <div className="relative flex h-11 items-center px-2 cursor-pointer">
      <Link href="/cart">
        <div className="flex items-center text-white">
          <span className="text-[32px] inline-block">
            <ShoppingCart />
          </span>
          <div className="ml-1">
            <div className="min-h-3 min-w-6 -mt-1.5">
              <span className="inline-block text-xs text-main-primary leading-4 bg-white rounded-lg text-center font-bold min-h-3 px-1 min-w-6">
                {totalItems}
              </span>
            </div>
            <strong className="text-xs font-bold text-wrap leading-4">
              Cart
            </strong>
          </div>
        </div>
      </Link>
    </div>
  );
}
