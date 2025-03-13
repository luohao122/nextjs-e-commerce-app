import * as z from "zod";

export const CouponFormSchema = z.object({
  code: z
    .string({
      required_error: "Coupon code is required.",
      invalid_type_error: "Coupon code must be a string.",
    })
    .min(2, { message: "Coupon code must be at least 2 characters long." })
    .max(50, { message: "Coupon code cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Only letters and numbers are allowed in the coupon code.",
    }),
  startDate: z.string({
    required_error: "Start date is required.",
    invalid_type_error: "Start date must be a valid date.",
  }),
  endDate: z.string({
    required_error: "End date is required.",
    invalid_type_error: "End date must be a valid date.",
  }),
  discount: z
    .number({
      required_error: "Discount is required.",
      invalid_type_error: "Discount must be a number.",
    })
    .min(1, { message: "Discount must be at least 1." })
    .max(99, { message: "Discount cannot exceed 99." }),
});
