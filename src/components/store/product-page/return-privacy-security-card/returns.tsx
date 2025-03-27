import { Undo } from "lucide-react";

const Returns = ({ returnPolicy }: { returnPolicy: string }) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <Undo className="w-4" />
          <span className="text-sm font-bold">Return Policy</span>
        </div>
      </div>
      <div>
        <span className="text-xs ml-5 text-[#979797] flex">{returnPolicy}</span>
      </div>
    </div>
  );
};

export default Returns;
