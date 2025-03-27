import { MonitorSmartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PlayStoreImg from "@/public/icons/google-play.webp";
import AppStoreImg from "@/public/icons/app-store.webp";

export default function DownloadApp() {
  return (
    <div className="relative group">
      <div className="flex h-11 items-center px-2 cursor-pointer">
        <span className="text-[32px]">
          <MonitorSmartphone />
        </span>
        <div className="ml-1">
          <strong className="max-w-[90px] inline-block font-medium text-xs text-white">
            Download the MarketHub app
          </strong>
        </div>
      </div>
      <div className="absolute hidden top-0 group-hover:block cursor-pointer">
        <div className="relative mt-12 -ml-20 w-[300px] bg-white rounded-3xl text-main-primary pt-2 px-1 pb-6 z-50 shadow-lg">
          <div className="w-0 h-0 absolute -top-1.5 left-36 !border-l-[10px] !border-l-transparent !border-r-[10px] !border-r-transparent !border-b-[10px] border-white"></div>
          <div className="py-3 px-1 break-words">
            <div className="flex">
              <div className="mx-3">
                <h3 className="font-bold text-[20px] text-main-primary m-0 max-w-40 mx-auto">
                  Download the MarketHub app
                </h3>
                <div className="mt-4 flex items-center gap-x-2">
                  <Link
                    href=""
                    className="rounded-3xl bg-black grid place-items-center px-4 py-3"
                  >
                    <Image src={AppStoreImg} alt="App Store" />
                  </Link>
                  <Link
                    href=""
                    className="rounded-3xl bg-black grid place-items-center px-4 py-3"
                  >
                    <Image src={PlayStoreImg} alt="Play Store" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
