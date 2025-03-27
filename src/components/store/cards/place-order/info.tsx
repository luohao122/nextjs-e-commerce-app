import { cn } from "@/lib/utils";

const Info = ({
  title,
  text,
  isBold,
  noBorder,
}: {
  title: string;
  text: string;
  isBold?: boolean;
  noBorder?: boolean;
}) => {
  return (
    <div
      className={cn(
        "mt-2 font-medium flex items-center text-[#222] text-sm pb-1 border-b",
        {
          "font-bold": isBold,
          "border-b-0": noBorder,
        }
      )}
    >
      <h2 className="overflow-hidden whitespace-nowrap text-ellipsis break-normal">
        {title}
      </h2>
      <h3 className="flex-1 w-0 min-w-0 text-right">
        <div className="px-0.5 text-black">
          <span className="text-black text-lg inline-block break-all">
            {text}
          </span>
        </div>
      </h3>
    </div>
  );
};

export default Info