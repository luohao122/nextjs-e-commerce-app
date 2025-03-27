import { Headset } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-x-6">
          <Headset className="scale-[190%] stroke-slate-400" />
          <div className="flex flex-col">
            <span className="text-[#59645f] text-sm">
              Got Questions? Call us 24/7
            </span>
            <span className="text-xl">(123) 1234-2345</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <strong>Contact Info</strong>
        <span className="text-sm">123 Maple Street, Dragan, FI 2630, HNI</span>
        {/* <div className="flex flex-wrap gap-2 mt-4">
          <Facebook />
        </div> */}
      </div>
    </div>
  );
}
