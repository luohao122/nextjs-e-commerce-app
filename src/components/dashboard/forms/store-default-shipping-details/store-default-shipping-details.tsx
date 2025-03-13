"use client";

import { FC, useLayoutEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { StoreDefaultShippingDetailsProps } from "@/components/dashboard/forms/store-default-shipping-details/store-default-shipping-details.types";
import { StoreShippingFormSchema } from "@/schemas/store-shipping-form";
import { AlertDialog } from "@/components/ui/alert-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateStoreDefaultShippingDetails } from "@/queries/store.query";

/**
 * StoreDefaultShippingDetails Component
 *
 * A form component used for creating or updating a store default shipping details. This component uses
 * react-hook-form with zod for schema validation and is integrated with an image upload
 * component and toast notifications. On submission, it calls the upsertStore default shipping details function
 * to persist the store default shipping details data.
 *
 * @component
 * @param {StoreDefaultShippingDetailsProps} props - Component properties.
 * @param {StoreDefaultShippingDetailsProps["data"]} props.data - The existing store default shipping details data. If provided,
 * the form will be populated with this data to allow for editing; otherwise, it is used to create a new store default shipping details.
 *
 * @example
 * // To create a new StoreDefaultShippingDetails:
 * <StoreDefaultShippingDetails storeUrl="store-url" data={null} />
 *
 * // To update an existing StoreDefaultShippingDetails:
 * <StoreDefaultShippingDetails storeUrl="store-url" data={existingStoreDefaultShippingDetailsData} />
 *
 * @returns {JSX.Element} The rendered StoreDefaultShippingDetails form component.
 */
const StoreDefaultShippingDetails: FC<StoreDefaultShippingDetailsProps> = ({
  data,
  storeUrl,
}) => {
  // Initialize toast notifications and Next.js router
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form with default values and Zod schema validation
  const form = useForm<z.infer<typeof StoreShippingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreShippingFormSchema),
    defaultValues: {
      defaultShippingService: data?.defaultShippingService,
      defaultShippingFeePerItem: data?.defaultShippingFeePerItem,
      defaultShippingFeeForAdditionalItem:
        data?.defaultShippingFeeForAdditionalItem,
      defaultShippingFeePerKg: data?.defaultShippingFeePerKg,
      defaultShippingFeeFixed: data?.defaultShippingFeeFixed,
      defaultDeliveryTimeMin: data?.defaultDeliveryTimeMin,
      defaultDeliveryTimeMax: data?.defaultDeliveryTimeMax,
      returnPolicy: data?.returnPolicy,
    },
  });

  // Determined loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  /**
   * Reset the form whenever the data prop changes.
   * useLayoutEffect is used here so that the form state is updated synchronously
   * before the component renders its controlled inputs.
   */
  useLayoutEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  /**
   * Handle form submission by calling updateStoreDefaultShippingDetails.
   * displays a toast notification upon success, and navigates accordingly.
   *
   * @param {z.infer<typeof StoreShippingFormSchema>} values - The form values to be submitted.
   */
  const handleSubmit = async (
    values: z.infer<typeof StoreShippingFormSchema>
  ) => {
    try {
      // Upsert the category data. Use v4() to generate a new id if creating a new category.
      const response = await updateStoreDefaultShippingDetails(storeUrl, {
        defaultShippingService: values.defaultShippingService,
        defaultShippingFeePerItem: values.defaultShippingFeePerItem,
        defaultShippingFeeForAdditionalItem:
          values.defaultShippingFeeForAdditionalItem,
        defaultShippingFeePerKg: values.defaultShippingFeePerKg,
        defaultShippingFeeFixed: values.defaultShippingFeeFixed,
        defaultDeliveryTimeMin: values.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: values.defaultDeliveryTimeMax,
        returnPolicy: values.returnPolicy,
      });

      if (response.id) {
        // Show a success toast with different messages based on creation vs. update
        toast({
          title: "Store Default shipping details has been updated.",
        });

        // Refresh the current route if updating; otherwise, navigate to the categories page
        router.refresh();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      // Display error toast notification
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.toString(),
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Store Default Shipping Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shipping Service name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultShippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee per item</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          placeholder="Shipping fee per item"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultShippingFeeForAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee for additional item</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          placeholder="Shipping fee for additional item"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultShippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping fee for by Kg</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          placeholder="Shipping fee for by Kg"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultShippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fixed Shipping fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          placeholder="Fixed Shipping fee"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultDeliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Delivery time (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="days"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="defaultDeliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Delivery time (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={2}
                          placeholder="days"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Return policy</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What's the return policy for your store?"
                        {...field}
                        className="p-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "loading..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDefaultShippingDetails;
