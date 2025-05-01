import Link from "next/link";
import { Check, ChevronLeft, DollarSign, Eye, Package, Truck, Wallet } from "lucide-react";

export default function OrdersOverview() {
  return (
    <div className="mt-4 bg-white p-4 border shadow-sm">
      <div className="flex items-center border-b">
        <div className="inline-block flex-1 py-3 text-xl font-bold">
          My Orders
        </div>
        <Link href="/profile/orders">
          <div className="flex items-center text-main-primary text-sm cursor-pointer">
            View All
            <span className="ml-2 text-lg inline-block">
              <ChevronLeft />
            </span>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-4 py-8">
        {menu.map((item) => (
          <Link key={item.link} href={item.link}>
            <div className="relative w-full flex flex-col justify-center items-center cursor-pointer">
              <div>{item.img}</div>
              <div className="text-main-primary">{item.title}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="relative flex items-center py-4 border-t cursor-pointer">
        <span className="text-2xl inline-block">
          <Eye />
        </span>
        <div className="ml-1.5 text-main-primary">My appeal</div>
        <span className="absolute right-0 text-main-secondary text-lg">
          <ChevronLeft />
        </span>
      </div>
      <div className="relative flex items-center py-4 border-t cursor-pointer">
        <span className="text-2xl inline-block">
          <DollarSign />
        </span>
        <div className="ml-1.5 text-main-primary">In dispute</div>
        <span className="absolute right-0 text-main-secondary text-lg">
          <ChevronLeft />
        </span>
      </div>
    </div>
  );
}
const menu = [
  {
    title: "Unpaid",
    img: <Wallet />,
    link: "/profile/orders/unpaid",
  },
  {
    title: "To be shipped",
    img: <Package />,
    link: "/profile/orders/toShip",
  },
  {
    title: "Shipped",
    img: <Truck />,
    link: "/profile/orders/shipped",
  },
  {
    title: "Delivered",
    img: <Check />,
    link: "/profile/orders/delivered",
  },
];
