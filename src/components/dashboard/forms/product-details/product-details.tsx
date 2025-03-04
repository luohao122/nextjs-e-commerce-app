"use client";

import { FC, useEffect, useLayoutEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { v4 } from "uuid";
import { WithOutContext as ReactTags, Tag } from "react-tag-input";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { SubCategory } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

import { ProductDetailsProps } from "@/components/dashboard/forms/product-details/product-details.types";
import { ProductFormSchema } from "@/schemas/product-form";
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

import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/dashboard/shared/image-upload/image-upload";
import { ROUTES } from "@/config/route-name";

import { Textarea } from "@/components/ui/textarea";
import { upsertProduct } from "@/queries/product.query";
import ImagesPreviewGrid from "@/components/dashboard/shared/images-preview-grid/images-preview-grid";

import ClickToAddInputs from "@/components/dashboard/forms/click-to-add/click-to-add";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllSubCategoriesForCategory } from "@/queries/category.query";

import { Checkbox } from "@/components/ui/checkbox";

/**
 * ProductDetails Component
 *
 * A form component used for creating or updating a product. This component uses
 * react-hook-form with zod for schema validation and is integrated with an image upload
 * component and toast notifications. On submission, it calls the upsertProduct function
 * to persist the product data.
 *
 * @component
 * @param {ProductDetailsProps} props - Component properties.
 * @param {ProductDetailsProps["data"]} props.data - The existing product data. If provided,
 * the form will be populated with this data to allow for editing; otherwise, it is used to create a new product.
 * @param {ProductDetailsProps["cloudinaryKey"]} props.cloudinaryKey - Cloudinary preset key used for image uploading.
 * @param {ProductDetailsProps["categories"]} props.categories - List of existing categories to attach to the product.
 * @param {ProductDetailsProps["storeUrl"]} props.storeUrl - The store this product should be attached to.

 * @example
 * // To create a new product:
 * <ProductDetails data={null} storeUrl="/amazon" categories={listCategories} cloudinaryKey="your_cloudinary_key" />
 *
 * // To update an existing product:
 * <ProductDetails data={existingProductData} storeUrl="/amazon" categories={listCategories} cloudinaryKey="your_cloudinary_key" />
 *
 * @returns {JSX.Element} The rendered ProductDetails form component.
 */
const ProductDetails: FC<ProductDetailsProps> = ({
  data,
  cloudinaryKey,
  categories,
  storeUrl,
}) => {
  // Initialize toast notifications and Next.js router
  const { toast } = useToast();
  const router = useRouter();
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [colors, setColors] = useState<{ color: string }[]>(
    data?.colors || [{ color: "" }]
  );
  const [sizes, setSizes] = useState<
    { size: string; price: number; quantity: number; discount: number }[]
  >(data?.sizes || [{ size: "", quantity: 1, price: 0.01, discount: 0 }]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  // Initialize the form with default values and Zod schema validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      variantName: data?.variantName || "",
      variantDescription: data?.variantDescription || "",
      // seoTitle: data?.seoTitle || "",
      // seoDescription: data?.seoDescription || "",
      images: data?.images || [],
      categoryId: data?.categoryId,
      subCategoryId: data?.subCategoryId,
      brand: data?.brand,
      sku: data?.sku,
      colors: data?.colors || [{ color: "" }],
      sizes: data?.sizes,
      keywords: data?.keywords,
      isSale: data?.isSale,
    },
  });

  // Determined loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  const errors = form.formState.errors;

  const categoryId = form.watch().categoryId;

  const handleAddKeyword = (keyword: Tag) => {
    if (keywords.length === 10) {
      return;
    }
    setKeywords((prev) => [...prev, keyword.text]);
  };

  const handleDeleteKeyword = (kidx: number) => {
    setKeywords(keywords.filter((_, index) => index !== kidx));
  };

  useEffect(() => {
    if (categoryId) {
      const fetchSubCategories = async () => {
        const response = await getAllSubCategoriesForCategory(categoryId);
        setSubCategories(response);
      };
      fetchSubCategories();
    }
  }, [categoryId]);

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
   * Handle form submission by calling upsertProduct.
   * Generates a new UUID for a new product, sets created and updated timestamps,
   * displays a toast notification upon success, and navigates accordingly.
   *
   * @param {z.infer<typeof ProductFormSchema>} values - The form values to be submitted.
   */
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      // Upsert the product data. Use v4() to generate a new id if creating a new product.
      const response = await upsertProduct(
        {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          name: values.name,
          description: values.description,
          variantName: values.variantName,
          variantDescription: values.variantDescription || "",
          seoTitle: "",
          seoDescription: "",
          images: values.images,
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          isSale: values.isSale,
          brand: values.brand,
          sku: values.sku,
          colors: values.colors,
          sizes: values.sizes || [],
          keywords: values.keywords || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl
      );

      // Show a success toast with different messages based on creation vs. update
      toast({
        title:
          data?.productId && data?.variantId
            ? "Product has been updated"
            : `Congratulations! product ${response.slug} is now created.`,
      });

      // Refresh the current route if updating; otherwise, navigate to the products page
      if (data?.productId && data?.variantId) {
        router.refresh();
      } else {
        router.push(`${ROUTES.SELLER_STORES_LIST}/${storeUrl}/products`);
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

  useEffect(() => {
    form.setValue("colors", colors);
  }, [colors, form]);

  useEffect(() => {
    form.setValue("sizes", sizes);
  }, [sizes, form]);

  useEffect(() => {
    form.setValue("keywords", keywords);
  }, [keywords, form]);

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {data?.productId && data?.variantId
              ? `Update ${data.name} product information`
              : `Let's create a product. You can edit product later from the product page.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex flex-col gap-y-6 xl:flex-row">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <div>
                          <ImagesPreviewGrid
                            onRemove={(url) => {
                              const updatedImages = images.filter(
                                (img) => img.url !== url
                              );
                              setImages(updatedImages);
                              field.onChange(updatedImages);
                            }}
                            images={form.getValues().images}
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="!mt-4" />
                          <ImageUpload
                            dontShowPreview={true}
                            type="standard"
                            value={field.value.map((image) => image.url)}
                            disabled={isLoading}
                            onChange={(url) =>
                              setImages((prevImages) => {
                                const updatedImages = [...prevImages, { url }];
                                field.onChange(updatedImages);
                                return updatedImages;
                              })
                            }
                            onRemove={(url) =>
                              field.onChange([
                                ...field.value.filter(
                                  (current) => current.url !== url
                                ),
                              ])
                            }
                            cloudinaryPreset={cloudinaryKey}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="w-full flex flex-col gap-y-3 xl:pl-5 border-r relative">
                  <ClickToAddInputs
                    details={colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  />
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product name</FormLabel>
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
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant name</FormLabel>
                      <FormControl>
                        <Input placeholder="Variant Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="variantDescription"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Category</FormLabel>
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
                {categoryId && subCategories.length > 0 && (
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product SubCategory</FormLabel>
                        <Select
                          disabled={isLoading || subCategories.length <= 0}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a sub-category"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subCategories.map((subCategory) => (
                              <SelectItem
                                key={subCategory.id}
                                value={subCategory.id}
                              >
                                {subCategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Brand" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="Product SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-3">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="keywords"
                  render={({}) => (
                    <FormItem className="relative flex-1">
                      <FormLabel>Product Keywords</FormLabel>
                      <FormControl>
                        <ReactTags
                          handleAddition={handleAddKeyword}
                          handleDelete={handleDeleteKeyword}
                          placeholder="Keywords (e.g., winter jacket, warm, stylish)"
                          classNames={{
                            tagInputField:
                              "bg-background border rounded-md p-2 w-full focus:outline-none",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-1">
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-x-2"
                    >
                      <span>{keyword}</span>
                      <span
                        onClick={() => handleDeleteKeyword(index)}
                        className="cursor-pointer"
                      >
                        x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex flex-col gap-y-3">
                <ClickToAddInputs
                  details={sizes}
                  setDetails={setSizes}
                  initialDetail={{
                    size: "",
                    quantity: 1,
                    price: 0.01,
                    discount: 0,
                  }}
                  header="Sizes, Quantities, Prices, Discounts"
                />
                {errors.sizes && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.sizes.message}
                  </span>
                )}
              </div>
              <FormField
                control={form.control}
                name="isSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>On Sale</FormLabel>
                      <FormDescription>
                        Is this product on sale?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center justify-between">
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "loading..."
                    : data?.productId && data.variantId
                    ? "Save product information"
                    : "Create Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
