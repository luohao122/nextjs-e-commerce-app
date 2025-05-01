import * as z from "zod";

export const StoreFormSchema = z.object({
  name: z
    .string({
      required_error: "Store name is required",
      invalid_type_error: "Store name must be a string",
    })
    .min(2, { message: "Store name must be at least 2 characters long." })
    .max(50, { message: "Store name cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
      message:
        "Only letters, numbers, space, hyphen, and underscore are allowed in the store name, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  description: z
    .string({
      required_error: "Store description is required",
      invalid_type_error: "Store description must be a string",
    })
    .min(30, {
      message: "Store description must be at least 30 characters long.",
    })
    .max(500, { message: "Store description cannot exceed 500 characters." }),
  email: z
    .string({
      required_error: "Store email is required",
      invalid_type_error: "Store email must be a string",
    })
    .email({ message: "Invalid email format." }),
  phone: z
    .string({
      required_error: "Store phone number is required",
      invalid_type_error: "Store phone number must be a string",
    })
    .regex(/^\+?\d+$/, { message: "Invalid phone number format." }),
  logo: z.object({ url: z.string() }).array().length(1, "Choose a logo image."),
  cover: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose a cover image."),
  url: z
    .string({
      required_error: "Store url is required",
      invalid_type_error: "Store url must be a string",
    })
    .min(2, { message: "Store url must be at least 2 characters long." })
    .max(50, { message: "Store url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the store url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
  featured: z.boolean().default(false).optional(),
  status: z.string().default("PENDING").optional(),
});

export const StoreShippingSchema = z.object({
  returnPolicy: z
    .string({
      required_error: "Return policy is required",
      invalid_type_error: "Return policy must be a string",
    })
    .default("Return in 30 days."),
  defaultShippingService: z
    .string({
      required_error: "Default shipping service is required",
      invalid_type_error: "Default shipping service must be a string",
    })
    .default("International Delivery"),
  defaultShippingFeePerItem: z
    .number({
      required_error: "Default shipping fee per item is required",
      invalid_type_error: "Default shipping fee per item must be a number",
    })
    .default(0),
  defaultShippingFeeForAdditionalItem: z
    .number({
      required_error: "Default shipping fee for additional items is required",
      invalid_type_error:
        "Default shipping fee for additional items must be a number",
    })
    .default(0),
  defaultShippingFeePerKg: z
    .number({
      required_error: "Default shipping fee per kilogram is required",
      invalid_type_error: "Default shipping fee per kilogram must be a number",
    })
    .default(0),
  defaultShippingFeeFixed: z
    .number({
      required_error: "Default fixed shipping fee is required",
      invalid_type_error: "Default fixed shipping fee must be a number",
    })
    .default(0),
  defaultDeliveryTimeMin: z
    .number({
      required_error: "Minimum delivery time is required",
      invalid_type_error: "Minimum delivery time must be a number",
    })
    .int()
    .default(7),
  defaultDeliveryTimeMax: z
    .number({
      required_error: "Maximum delivery time is required",
      invalid_type_error: "Maximum delivery time must be a number",
    })
    .int()
    .default(31),
});