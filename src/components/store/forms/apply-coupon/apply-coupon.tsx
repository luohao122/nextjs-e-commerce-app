import { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/store/ui/button";
import { applyCoupon } from "@/queries/coupon.query";

import { ApplyCouponFormSchema } from "@/schemas/apply-coupon-form";
import { CartWithCartItemsType } from "@/types/cart.types";
import { useToast } from "@/hooks/use-toast";

export default function ApplyCouponForm({
  cartId,
  setCartData,
}: {
  cartId: string;
  setCartData: Dispatch<SetStateAction<CartWithCartItemsType>>;
}) {
  const { toast } = useToast();
  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof ApplyCouponFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(ApplyCouponFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      coupon: "",
    },
  });

  // Loading status& Errors
  const { errors } = form.formState;

  // Submit handler for form submission
  const handleSubmit = async (
    values: z.infer<typeof ApplyCouponFormSchema>
  ) => {
    try {
      const res = await applyCoupon(values.coupon, cartId);
      setCartData(res.cart);
      toast({ title: res.message });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);
      toast({ title: error.toString() });
    }
  };

  return (
    <div className="rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Form items */}
          <div className="relative bg-gray-100 rounded-2xl shadow-sm p-1.5 hover:shadow-md">
            <FormField
              control={form.control}
              name="coupon"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full pl-8 pr-24 py-3 text-base text-main-primary bg-transparent rounded-lg focus:outline-none"
                      placeholder="Coupon"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 w-20 rounded-2xl"
            >
              Apply
            </Button>
          </div>
          <div className="mt-3">
            {errors.coupon && (
              <FormMessage className="text-xs">
                {errors.coupon.message}
              </FormMessage>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
