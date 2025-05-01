import { Coupon } from "@prisma/client";

export interface CouponDetailsProps {
  data?: Coupon;
  storeUrl: string;
}

