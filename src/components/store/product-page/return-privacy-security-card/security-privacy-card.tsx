import { ShieldCheck } from "lucide-react";

const SecurityPrivacyCard = () => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <ShieldCheck className="w-4" />
          <span className="text-sm font-bold">Security & Privacy</span>
        </div>
      </div>
      <p className="text-xs text-[#979797] ml-5 flex  gap-x-1">
        Safe payments: We do not share your personal details with any third
        parties without your consent. Secure personal details: We protect your
        privacy and keep your personal details safe and secure.
      </p>
    </div>
  );
};

export default SecurityPrivacyCard;
