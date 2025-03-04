import { FC, useEffect, useState } from "react";

import { ImagesPreviewGridProps } from "@/components/dashboard/shared/images-preview-grid/images-preview-grid.types";
import NoImageImg from "../../../../../public/images/no_image_2.png";
import Image from "next/image";
import { cn, getDominantColors, getGridClassName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import ColorPalette from "../color-palette/color-palette";

const ImagesPreviewGrid: FC<ImagesPreviewGridProps> = ({
  images = [],
  onRemove,
  colors,
  setColors,
}) => {
  const [colorPalettes, setColorPalettes] = useState<string[][]>([]);
  useEffect(() => {
    const fetchColors = async () => {
      const palettes = await Promise.all(
        images.map(async (img) => {
          try {
            const colors = await getDominantColors(img.url);
            return colors;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            return [];
          }
        })
      );
      setColorPalettes(palettes);
    };
    if (images.length > 0) {
      fetchColors();
    }
  }, [images]);

  if (images && !images.length) {
    return (
      <div>
        <Image
          src={NoImageImg}
          alt="No images available"
          width={500}
          height={600}
          className="rounded-md"
        />
      </div>
    );
  }

  const gridClassName = getGridClassName(images.length) || "";

  return (
    <div className="max-w-4xl">
      <div
        className={cn(
          `grid h-[800px] overflow-hidden bg-white rounded-md`,
          gridClassName
        )}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className={cn(
              "relative group h-full w-full border border-gray-300",
              `grid_${images.length}_image_${i + 1}`,
              {
                "h-[266.66px]": images.length === 6,
              }
            )}
          >
            <Image
              src={img.url}
              alt={`product-image-${i}`}
              width={800}
              height={800}
              className="w-full h-full object-cover object-top"
            />
            <div
              className={cn(
                "absolute top-0 left-0 right-0 bottom-0 hidden group-hover:flex bg-white/55 cursor-pointer justify-center items-center flex-col gap-y-3 transition-all duration-500",
                {
                  "!pb-[40%]": images.length === 1,
                }
              )}
            >
              <ColorPalette
                colors={colors}
                setColors={setColors}
                extractedColors={colorPalettes[i]}
              />
              <Button
                className=""
                type="button"
                onClick={() => onRemove(img.url)}
              >
                <Trash size={18} />
                <div>Delete</div>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesPreviewGrid;
