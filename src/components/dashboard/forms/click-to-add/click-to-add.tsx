import { useEffect, useRef, useState } from "react";
import { PaintBucket } from "lucide-react";
import { SketchPicker } from "react-color";

import { Input } from "@/components/ui/input";
import {
  ClickToAddInputsProps,
  Detail,
} from "@/components/dashboard/forms/click-to-add/click-to-add.types";
import PlusButton from "@/components/dashboard/forms/click-to-add/components/PlusButton";

import MinusButton from "@/components/dashboard/forms/click-to-add/components/MinusButton";
import { cn } from "@/lib/utils";

const ClickToAddInputs = <T extends Detail>({
  details,
  setDetails,
  initialDetail = {} as T,
  header,
  colorPicker,
  containerClassName,
  inputClassName
}: ClickToAddInputsProps<T>) => {
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  const [colorPickerIndex, setColorPickerIndex] = useState<number | null>(null);
  const handleDetailsChange = (
    index: number,
    property: string,
    value: string | number
  ) => {
    const updateDetails = details.map((detail, i) =>
      i === index ? { ...detail, [property]: value } : detail
    );
    setDetails(updateDetails);
  };

  const handleAddDetail = () => {
    setDetails([
      ...details,
      {
        ...initialDetail,
      },
    ]);
  };

  const handleRemoveDetail = (index: number) => {
    if (details.length === 1) {
      return;
    }

    const updatedDetails = details.filter((_, i) => i !== index);
    setDetails(updatedDetails);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setColorPickerIndex(null);
      }
    };

    if (colorPickerIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [colorPickerIndex]);

  return (
    <div className="flex flex-col gap-y-4">
      {header && <div>{header}</div>}
      {!details.length && <PlusButton onClick={handleAddDetail} />}
      {details.map((detail, index) => (
        <div key={index} className="flex items-center gap-x-4">
          {Object.keys(detail).map((property, propIndex) => (
            <div key={propIndex} className={cn("flex items-center gap-x-4", containerClassName)}>
              {property === "color" && colorPicker && (
                <div className="flex gap-x-4">
                  <button
                    onClick={() => {
                      setColorPickerIndex(
                        colorPickerIndex === index ? null : index
                      );
                    }}
                    type="button"
                    className="cursor-pointer"
                  >
                    <PaintBucket />
                  </button>
                  <span
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: `${detail[property]}` }}
                  />
                </div>
              )}
              {colorPickerIndex === index && property === "color" && (
                <div
                  className="absolute top-10 left-0 z-50"
                  ref={colorPickerRef}
                >
                  <SketchPicker
                    color={`${detail[property]}`}
                    onChange={(e) => {
                      handleDetailsChange(index, property, e.hex);
                    }}
                  />
                </div>
              )}
              <Input
                onChange={(e) =>
                  handleDetailsChange(
                    index,
                    property,
                    e.target.type === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value
                  )
                }
                className={cn("w-28 placeholder:capitalize", inputClassName)}
                type={typeof detail[property] === "number" ? "number" : "text"}
                step={typeof detail[property] === "number" ? 0.01 : undefined}
                name={property}
                placeholder={property}
                value={detail[property] as string}
                min={typeof detail[property] === "number" ? 0 : undefined}
              />
            </div>
          ))}
          <MinusButton onClick={() => handleRemoveDetail(index)} />
          <PlusButton onClick={handleAddDetail} />
        </div>
      ))}
    </div>
  );
};

export default ClickToAddInputs;
