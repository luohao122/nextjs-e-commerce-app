"use client";

import { FC, useLayoutEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { v4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";

import { StoreDetailsProps } from "@/components/dashboard/forms/store-details/store-details.types";
import { StoreFormSchema } from "@/schemas/store-form";
import { AlertDialog } from "@/components/ui/alert-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/dashboard/shared/image-upload/image-upload";

import { ROUTES } from "@/config/route-name";
import { Textarea } from "@/components/ui/textarea";
import { upsertStore } from "@/queries/store.query";
import Link from "next/link";
import { StoreIcon } from "lucide-react";

/**
 * StoreDetails Component
 *
 * A form component used for creating or updating a store. This component uses
 * react-hook-form with zod for schema validation and is integrated with an image upload
 * component and toast notifications. On submission, it calls the upsertStore function
 * to persist the store data.
 *
 * @component
 * @param {StoreDetailsProps} props - Component properties.
 * @param {StoreDetailsProps["data"]} props.data - The existing store data. If provided,
 * the form will be populated with this data to allow for editing; otherwise, it is used to create a new store.
 * @param {StoreDetailsProps["cloudinaryKey"]} props.cloudinaryKey - Cloudinary preset key used for image uploading.
 *
 * @example
 * // To create a new store:
 * <StoreDetails data={null} cloudinaryKey="your_cloudinary_key" />
 *
 * // To update an existing store:
 * <StoreDetails data={existingStoreData} cloudinaryKey="your_cloudinary_key" />
 *
 * @returns {JSX.Element} The rendered StoreDetails form component.
 */
const StoreDetails: FC<StoreDetailsProps> = ({
  data,
  cloudinaryKey,
  showBackToStoresButton,
}) => {
  // Initialize toast notifications and Next.js router
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form with default values and Zod schema validation
  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      email: data?.email || "",
      phone: data?.phone || "",
      logo: data?.logo ? [{ url: data.logo }] : [],
      cover: data?.cover ? [{ url: data.cover }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      status: data?.status.toString(),
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
      form.reset({
        name: data?.name,
        description: data?.description,
        email: data?.email,
        phone: data?.phone,
        logo: [{ url: data.logo }],
        cover: [{ url: data.cover }],
        url: data?.url,
        featured: data?.featured,
        status: data?.status,
      });
    }
  }, [data, form]);

  /**
   * Handle form submission by calling upsertStore.
   * Generates a new UUID for a new store, sets created and updated timestamps,
   * displays a toast notification upon success, and navigates accordingly.
   *
   * @param {z.infer<typeof StoreFormSchema>} values - The form values to be submitted.
   */
  const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    try {
      // Upsert the store data. Use v4() to generate a new id if creating a new store.
      const response = await upsertStore({
        id: data?.id ? data.id : v4(),
        name: values.name,
        email: values.email,
        description: values.description,
        phone: values.phone,
        logo: values.logo[0].url,
        cover: values.cover[0].url,
        url: values.url,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Show a success toast with different messages based on creation vs. update
      toast({
        title: data?.id
          ? "Store has been updated"
          : `Congratulations! ${response.name} is now created.`,
      });

      // Refresh the current route if updating; otherwise, navigate to the stores page
      if (data?.id) {
        router.refresh();
      } else {
        router.push(`${ROUTES.SELLER_STORES_LIST}/${response.url}`);
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
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data.name} store information`
              : `Let's create a store. You can edit store later from the store settings page.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 -left-48 z-10 inset-x-96">
                      <FormControl>
                        <ImageUpload
                          type="profile"
                          value={field.value.map((image) => image.url)}
                          disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                          cloudinaryPreset={cloudinaryKey}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
                          value={field.value.map((image) => image.url)}
                          disabled={isLoading}
                          onChange={(url) => field.onChange([{ url }])}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                          cloudinaryPreset={cloudinaryKey}
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
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store url</FormLabel>
                    <FormControl>
                      <Input placeholder="/store-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This Store will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center justify-between">
                {showBackToStoresButton && (
                  <Link href={ROUTES.SELLER_STORES_LIST}>
                    <Button variant="outline">
                      <StoreIcon /> Back to Stores page
                    </Button>
                  </Link>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "loading..."
                    : data?.id
                    ? "Save store information"
                    : "Create Store"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;
