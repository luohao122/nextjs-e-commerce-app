"use client";

import { FC, useLayoutEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

import { useRouter } from "next/navigation";

import { SubCategoryDetailsProps } from "@/components/dashboard/forms/sub-category-details/sub-category-details.types";
import { SubCategoryFormSchema } from "@/schemas/sub-category-form";
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

import { upsertSubCategory } from "@/queries/sub-category.query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/config/route-name";

/**
 * SubCategoryDetails Component
 *
 * A form component used for creating or updating a sub-category. This component uses
 * react-hook-form with zod for schema validation and is integrated with an image upload
 * component and toast notifications. On submission, it calls the upsertCategory function
 * to persist the sub-category data.
 *
 * @component
 * @param {SubCategoryDetailsProps} props - Component properties.
 * @param {SubCategoryDetailsProps["data"]} props.data - The existing sub-category data. If provided,
 * the form will be populated with this data to allow for editing; otherwise, it is used to create a new sub-category.
 * @param {SubCategoryDetailsProps["cloudinaryKey"]} props.cloudinaryKey - Cloudinary preset key used for image uploading.
 *
 * @example
 * // To create a new sub category:
 * <SubCategoryDetails data={null} cloudinaryKey="your_cloudinary_key" />
 *
 * // To update an existing category:
 * <SubCategoryDetails data={existingCategoryData} cloudinaryKey="your_cloudinary_key" />
 *
 * @returns {JSX.Element} The rendered SubCategoryDetails form component.
 */
const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({
  data,
  cloudinaryKey,
  categories,
}) => {
  // Initialize toast notifications and Next.js router
  const { toast } = useToast();
  const router = useRouter();

  // Initialize the form with default values and Zod schema validation
  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      categoryId: data?.categoryId,
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
        categoryId: data?.categoryId,
      });
    }
  }, [data, form]);

  /**
   * Handle form submission by calling upsertCategory.
   * Generates a new UUID for a new sub-category, sets created and updated timestamps,
   * displays a toast notification upon success, and navigates accordingly.
   *
   * @param {z.infer<typeof SubCategoryFormSchema>} values - The form values to be submitted.
   */
  const handleSubmit = async (
    values: z.infer<typeof SubCategoryFormSchema>
  ) => {
    try {
      // Upsert the sub-category data. Use v4() to generate a new id if creating a new sub-category.
      const response = await upsertSubCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        categoryId: values.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Show a success toast with different messages based on creation vs. update
      toast({
        title: data?.id
          ? "SubCategory has been updated"
          : `Congratulations! ${response.name} is now created.`,
      });

      // Refresh the current route if updating; otherwise, navigate to the sub-categories page
      if (data?.id) {
        router.refresh();
      } else {
        router.push(ROUTES.ADMIN_SUB_CATEGORIES_LIST);
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
          <CardTitle>SubCategory Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data.name} sub-category information`
              : `Let's create a sub-category. You can edit sub-category later from the sub-category page.`}
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
                    <FormLabel>SubCategory name</FormLabel>
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
                    <FormLabel>SubCategory url</FormLabel>
                    <FormControl>
                      <Input placeholder="/sub-category-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      disabled={isLoading || categories.length <= 0}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a parent category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        This SubCategory will appear on the home page
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
                  : "Create sub-category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
