"use client";

import { FC, useLayoutEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

import { useRouter } from "next/navigation";

import { CategoryDetailsProps } from "@/components/dashboard/forms/category-details/category-details.types";
import { CategoryFormSchema } from "@/schemas/category-form";
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

import { upsertCategory } from "@/queries/category.query";
import { ROUTES } from "@/config/route-name";

/**
 * CategoryDetails Component
 *
 * A form component used for creating or updating a category. This component uses
 * react-hook-form with zod for schema validation and is integrated with an image upload
 * component and toast notifications. On submission, it calls the upsertCategory function
 * to persist the category data.
 *
 * @component
 * @param {CategoryDetailsProps} props - Component properties.
 * @param {CategoryDetailsProps["data"]} props.data - The existing category data. If provided,
 * the form will be populated with this data to allow for editing; otherwise, it is used to create a new category.
 * @param {CategoryDetailsProps["cloudinaryKey"]} props.cloudinaryKey - Cloudinary preset key used for image uploading.
 *
 * @example
 * // To create a new category:
 * <CategoryDetails data={null} cloudinaryKey="your_cloudinary_key" />
 *
 * // To update an existing category:
 * <CategoryDetails data={existingCategoryData} cloudinaryKey="your_cloudinary_key" />
 *
 * @returns {JSX.Element} The rendered CategoryDetails form component.
 */
const CategoryDetails: FC<CategoryDetailsProps> = ({ data, cloudinaryKey }) => {
  // Initialize toast notifications and Next.js router
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form with default values and Zod schema validation
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
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
        image: [{ url: data.image }],
        url: data?.url,
        featured: data?.featured,
      });
    }
  }, [data, form]);

  /**
   * Handle form submission by calling upsertCategory.
   * Generates a new UUID for a new category, sets created and updated timestamps,
   * displays a toast notification upon success, and navigates accordingly.
   *
   * @param {z.infer<typeof CategoryFormSchema>} values - The form values to be submitted.
   */
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      // Upsert the category data. Use v4() to generate a new id if creating a new category.
      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Show a success toast with different messages based on creation vs. update
      toast({
        title: data?.id
          ? "Category has been updated"
          : `Congratulations! ${response.name} is now created.`,
      });

      // Refresh the current route if updating; otherwise, navigate to the categories page
      if (data?.id) {
        router.refresh();
      } else {
        router.push(ROUTES.ADMIN_CATEGORIES_LIST);
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
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data.name} category information`
              : `Let's create a category. You can edit category later from the category page.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
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
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category name</FormLabel>
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
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category url</FormLabel>
                    <FormControl>
                      <Input placeholder="/category-url" {...field} />
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
                        This Category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save category information"
                  : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
