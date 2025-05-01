import { PrismaClient } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import ColorThief from "colorthief";
import { differenceInDays, differenceInHours } from "date-fns";

import { db } from "./db";
import { Country, IPCountryPayload } from "@/types/types";
import countries from "@/data/countries.json";

import { LOCALSTORAGE_KEYS } from "@/config/constants";
import { CartProductType } from "@/types/cart.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

export const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = "slug",
  separator: string = "-"
) => {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingRecord = await (db[model] as any).findFirst({
      where: {
        [field]: slug,
      },
    });
    if (!existingRecord) {
      break;
    }
    slug = `${slug}${separator}${suffix}`;
    suffix += 1;
  }

  return slug;
};

const DEFAULT_COUNTRY: Country = {
  name: "United States",
  code: "US",
  city: "",
  region: "",
};

export async function getUserCountry(): Promise<Country> {
  let userCountry: Country = DEFAULT_COUNTRY;
  try {
    // Attempt to detect country by IP
    const response = await fetch(
      `https://ipinfo.io/?token=${process.env.IP_INFO_TOKEN}`
    );

    if (response.ok) {
      const data: IPCountryPayload = await response.json();
      userCountry = {
        name:
          countries.find((c) => c.code === data.country)?.name || data.country,
        code: data.country,
        city: data.city,
        region: data.region,
      };
    }
  } catch (error) {
    // Log error if necessary but do not throw
    console.error("Failed to fetch IP info", error);
  }
  return userCountry;
}

export const getShippingDatesRange = (
  minDays: number,
  maxDays: number,
  date?: Date
) => {
  const currentDate = date ? new Date(date) : new Date();
  const minDate = new Date(currentDate);
  minDate.setDate(currentDate.getDate() + minDays);

  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + maxDays);

  return {
    minDate: minDate.toDateString(),
    maxDate: maxDate.toDateString(),
  };
};

export const isProductValidToAdd = (product: CartProductType): boolean => {
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    image,
    quantity,
    price,
    sizeId,
    size,
    stock,
    shippingMethod,
    variantImage,
    weight,
    deliveryTimeMin,
    deliveryTimeMax,
  } = product;

  // Ensure that all necessary fields have values
  if (
    !productId ||
    !variantId ||
    !productSlug ||
    !variantSlug ||
    !name ||
    !variantName ||
    !image ||
    quantity <= 0 ||
    price <= 0 ||
    !sizeId || // Ensure sizeId is not empty
    !size || // Ensure size is not empty
    stock <= 0 ||
    weight <= 0 || // Weight should be <= 0
    !shippingMethod ||
    !variantImage ||
    deliveryTimeMin < 0 ||
    deliveryTimeMax < deliveryTimeMin // Ensure delivery times are valid
  ) {
    return false; // Validation failed
  }

  return true; // Product is valid
};

type CensorReturn = {
  firstName: string;
  lastName: string;
  fullName: string;
};

export const censorName = (
  firstName: string,
  lastName: string
): CensorReturn => {
  const censor = (name: string): string => {
    if (name.length <= 2) return name;
    const firstChar = name[0];
    const lastChar = name[name.length - 1];
    const middleLength = name.length - 2;
    return `${firstChar}${"*".repeat(middleLength)}${lastChar}`;
  };

  const censorFullName = `${firstName[0]}***${lastName[lastName.length - 1]}`;
  return {
    firstName: censor(firstName),
    lastName: censor(lastName),
    fullName: censorFullName,
  };
};

export const getTimeUntil = (
  targetDate: string
): { days: number; hours: number } => {
  // Convert the date string to a Date object
  const target = new Date(targetDate);
  const now = new Date();

  // Ensure the target date is in the future
  if (target <= now) return { days: 0, hours: 0 };

  // Calculate days and hours left
  const totalDays = differenceInDays(target, now);
  const totalHours = differenceInHours(target, now) % 24;

  return { days: totalDays, hours: totalHours };
};

export const downloadBlobAsFile = (blob: Blob, filename: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const printPDF = (blob: Blob) => {
  const pdfUrl = URL.createObjectURL(blob);
  const printWindow = window.open(pdfUrl, "_blank");
  if (printWindow) {
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  }
};

export const updateProductHistory = (variantId: string) => {
  // Fetch existing product history from localStorage
  let productHistory: string[] = [];
  const historyString = localStorage.getItem(LOCALSTORAGE_KEYS.PRODUCT_HISTORY);
  if (historyString) {
    try {
      productHistory = JSON.parse(historyString);
    } catch {
      productHistory = [];
    }
  }

  // Update the history: Remove the product if it exists, and add it to the front
  productHistory = productHistory.filter((id) => id !== variantId);
  productHistory.unshift(variantId);

  // Check storage limit (manage max number of products)
  const MAX_PRODUCTS = 20;
  if (productHistory.length > MAX_PRODUCTS) {
    productHistory.pop(); // Remove the oldest product
  }
  // Save updated history to localStorage
  localStorage.setItem(
    LOCALSTORAGE_KEYS.PRODUCT_HISTORY,
    JSON.stringify(productHistory)
  );
};
