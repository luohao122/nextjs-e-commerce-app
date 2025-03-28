"use client";

import {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { v4 } from "uuid";
import { WithOutContext as ReactTags, Tag } from "react-tag-input";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { ShippingFeeMethod, SubCategory } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

import { format } from "date-fns";
import DateTimePicker from "react-datetime-picker";
import JoditEditor from "jodit-react";

import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

import { useTheme } from "next-themes";
import { MultiSelect } from "react-multi-select-component";

import {
  CountryOption,
  ProductDetailsProps,
} from "@/components/dashboard/forms/product-details/product-details.types";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/dashboard/shared/image-upload/image-upload";
import { ROUTES } from "@/config/route-name";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Checkbox } from "@/components/ui/checkbox";
import InputFieldset from "@/components/dashboard/shared/input-fieldset/input-fieldset";
import { Dot } from "lucide-react";

const shippingFeeMethods = [
  {
    value: ShippingFeeMethod.ITEM,
    description: "ITEM (Fees calculated based on number of products.)",
  },
  {
    value: ShippingFeeMethod.WEIGHT,
    description: "WEIGHT (Fees calculated based on product weight)",
  },
  {
    value: ShippingFeeMethod.FIXED,
    description: "FIXED (Fees are fixed.)",
  },
];

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
  offerTags,
  countries,
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

  const [productSpecs, setProductSpecs] = useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  const [variantSpecs, setVariantSpecs] = useState<
    { name: string; value: string }[]
  >(data?.variant_specs || [{ name: "", value: "" }]);

  const [questions, setQuestions] = useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const productDesEditor = useRef(null);
  const productVariantDesEditor = useRef(null);
  const isNewVariantPage = data?.productId && !data?.variantId;

  const countryOptions: CountryOption[] = countries.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const { theme } = useTheme();

  const config = useMemo(
    () => ({
      theme: theme === "dark" ? "dark" : "default",
    }),
    [theme]
  );

  // Initialize the form with default values and Zod schema validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      variantName: data?.variantName || "",
      variantDescription: data?.variantDescription || "",
      variantImage: data?.variantImage ? [{ url: data.variantImage }] : [],
      // seoTitle: data?.seoTitle || "",
      // seoDescription: data?.seoDescription || "",
      images: data?.images || [],
      categoryId: data?.categoryId,
      subCategoryId: data?.subCategoryId,
      offerTagId: data?.offerTagId || "",
      brand: data?.brand,
      sku: data?.sku,
      colors: data?.colors,
      sizes: data?.sizes,
      product_specs: data?.product_specs,
      variant_specs: data?.variant_specs,
      keywords: data?.keywords,
      questions: data?.questions,
      isSale: data?.isSale,
      weight: data?.weight,
      saleEndDate:
        data?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      freeShippingForAllCountries: data?.freeShippingForAllCountries,
      freeShippingCountriesIds: data?.freeShippingCountriesIds || [],
      shippingFeeMethod: data?.shippingFeeMethod,
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
      form.reset({
        ...data,
        variantImage: data.variantImage ? [{ url: data.variantImage }] : [],
      });
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
      await upsertProduct(
        {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          name: values.name,
          description: values.description,
          variantName: values.variantName,
          variantDescription: values.variantDescription || "",
          variantImage: values.variantImage[0].url,
          seoTitle: "",
          seoDescription: "",
          images: values.images,
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          offerTagId: values.offerTagId || "",
          isSale: values.isSale,
          saleEndDate: values.saleEndDate,
          brand: values.brand,
          sku: values.sku,
          weight: values.weight,
          colors: values.colors,
          sizes: values.sizes || [],
          keywords: values.keywords || [],
          product_specs: values.product_specs || [],
          variant_specs: values.variant_specs || [],
          questions: values.questions || [],
          shippingFeeMethod: values.shippingFeeMethod,
          freeShippingForAllCountries: values.freeShippingForAllCountries,
          freeShippingCountriesIds: values.freeShippingCountriesIds || [],
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
            : `Congratulations! product is now created.`,
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

  useEffect(() => {
    form.setValue("product_specs", productSpecs);
  }, [productSpecs, form]);

  useEffect(() => {
    form.setValue("variant_specs", variantSpecs);
  }, [variantSpecs, form]);

  useEffect(() => {
    form.setValue("questions", questions);
  }, [questions, form]);

  const handleDeleteCountryFreeShipping = (index: number) => {
    const currentValues = form.getValues().freeShippingCountriesIds;
    const updatedValues = currentValues.filter((_, i) => i !== index);
    form.setValue("freeShippingCountriesIds", updatedValues);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isNewVariantPage
              ? `Add a new variant to ${data.name}`
              : "Create a new product"}
          </CardTitle>
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

              {/* Product name, etc */}
              <InputFieldset label="Name">
                <div className="flex flex-col lg:flex-row gap-4">
                  {!isNewVariantPage && (
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Product Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="variantName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Variant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Variant Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>

              {/* Tabs */}
              <InputFieldset
                label="Description"
                description={
                  isNewVariantPage
                    ? ""
                    : "Note: The product description is the main description for the product (Will display in every variant page). You can add an extra description specific to this variant using 'Variant description' tab."
                }
              >
                <Tabs
                  defaultValue={isNewVariantPage ? "variant" : "product"}
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="product">
                        Product description
                      </TabsTrigger>
                      <TabsTrigger value="variant">
                        Variant description
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="product">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="description"
                      render={({}) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              config={config}
                              value={form.getValues().description}
                              ref={productDesEditor}
                              onChange={(content) => {
                                form.setValue("description", content);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="variant">
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="variantDescription"
                      render={({}) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <JoditEditor
                              config={config}
                              value={form.getValues().variantDescription}
                              ref={productVariantDesEditor}
                              onChange={(content) => {
                                form.setValue("variantDescription", content);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </InputFieldset>
              {/* Category, sub-category, offer tags */}
              {!isNewVariantPage && (
                <InputFieldset label="Category">
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
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
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
                              disabled={
                                isLoading ||
                                categories.length == 0 ||
                                !form.getValues().categoryId
                              }
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
                    {/* Offer Tag */}
                    <FormField
                      disabled={isLoading}
                      control={form.control}
                      name="offerTagId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Offer Tags</FormLabel>
                          <Select
                            disabled={isLoading || categories.length == 0}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Select an offer"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {offerTags &&
                                offerTags.map((offer) => (
                                  <SelectItem key={offer.id} value={offer.id}>
                                    {offer.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </InputFieldset>
              )}

              {/* Brand, SKU, etc */}
              <InputFieldset
                label={isNewVariantPage ? "Sku, Weight" : "Brand, Sku, Weight"}
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {!isNewVariantPage && (
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
                  )}
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
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Product Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0.01}
                            step={0.01}
                            placeholder="Product Weight"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </InputFieldset>

              {/* Variant image - Keywords */}
              <div className="flex items-center gap-10 py-14">
                <div className="border-r pr-10">
                  <FormField
                    control={form.control}
                    name="variantImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-center">
                          Variant Image
                        </FormLabel>
                        <FormControl>
                          <ImageUpload
                            dontShowPreview
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
                        <FormMessage className="!mt-4" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1 w-full space-y-3">
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
              </div>

              {/* Sizes */}
              <InputFieldset label="Sizes, Quantities, Prices, Disocunts">
                <div className="w-full flex flex-col gap-y-3">
                  <ClickToAddInputs
                    containerClassName="flex-1"
                    inputClassName="w-full"
                    details={sizes}
                    setDetails={setSizes}
                    initialDetail={{
                      size: "",
                      quantity: 1,
                      price: 0.01,
                      discount: 0,
                    }}
                  />
                  {errors.sizes && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.sizes.message}
                    </span>
                  )}
                </div>
              </InputFieldset>

              {/* Product and variant specs*/}
              <InputFieldset
                label="Specifications"
                description={
                  isNewVariantPage
                    ? ""
                    : "Note: The product specifications are the main specs for the product (Will display in every variant page). You can add extra specs specific to this variant using 'Variant Specifications' tab."
                }
              >
                <Tabs
                  defaultValue={
                    isNewVariantPage ? "variantSpecs" : "productSpecs"
                  }
                  className="w-full"
                >
                  {!isNewVariantPage && (
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="productSpecs">
                        Product Specifications
                      </TabsTrigger>
                      <TabsTrigger value="variantSpecs">
                        Variant Specifications
                      </TabsTrigger>
                    </TabsList>
                  )}
                  <TabsContent value="productSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <ClickToAddInputs
                        containerClassName="flex-1"
                        inputClassName="w-full"
                        details={productSpecs}
                        setDetails={setProductSpecs}
                        initialDetail={{
                          name: "",
                          value: "",
                        }}
                      />
                      {errors.product_specs && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.product_specs.message}
                        </span>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="variantSpecs">
                    <div className="w-full flex flex-col gap-y-3">
                      <ClickToAddInputs
                        containerClassName="flex-1"
                        inputClassName="w-full"
                        details={variantSpecs}
                        setDetails={setVariantSpecs}
                        initialDetail={{
                          name: "",
                          value: "",
                        }}
                      />
                      {errors.variant_specs && (
                        <span className="text-sm font-medium text-destructive">
                          {errors.variant_specs.message}
                        </span>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </InputFieldset>

              {/* Questions*/}
              {!isNewVariantPage && (
                <InputFieldset label="Questions & Answers">
                  <div className="w-full flex flex-col gap-y-3">
                    <ClickToAddInputs
                      details={questions}
                      setDetails={setQuestions}
                      initialDetail={{
                        question: "",
                        answer: "",
                      }}
                      containerClassName="flex-1"
                      inputClassName="w-full"
                    />
                    {errors.questions && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.questions.message}
                      </span>
                    )}
                  </div>
                </InputFieldset>
              )}

              {/* Is On Sale */}
              <InputFieldset
                label="Sale"
                description="Is your product on sale ?"
              >
                <div>
                  <label className="ml-5 flex items-center gap-x-2 cursor-pointer">
                    <FormField
                      control={form.control}
                      name="isSale"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>Yes</span>
                  </label>
                  {form.getValues().isSale && (
                    <div className="mt-5">
                      <p className="text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                        <Dot className="-me-1" />
                        When sale does end ?
                      </p>
                      <div className="flex items-center gap-x-5">
                        <FormField
                          control={form.control}
                          name="saleEndDate"
                          render={({ field }) => (
                            <FormItem className="ml-4">
                              <FormControl>
                                <DateTimePicker
                                  className="inline-flex items-center gap-2 p-2 border rounded-md shadow-sm"
                                  onChange={(date) => {
                                    field.onChange(
                                      date
                                        ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                        : ""
                                    );
                                  }}
                                  value={
                                    field.value ? new Date(field.value) : null
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </InputFieldset>

              {/* Shipping fee method */}
              {!isNewVariantPage && (
                <InputFieldset label="Product shipping fee method">
                  <FormField
                    disabled={isLoading}
                    control={form.control}
                    name="shippingFeeMethod"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select Shipping Fee Calculation method"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {shippingFeeMethods.map((method) => (
                              <SelectItem
                                key={method.value}
                                value={method.value}
                              >
                                {method.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </InputFieldset>
              )}

              {/* Free shipping */}
              {!isNewVariantPage && (
                <InputFieldset
                  label="Free Shipping (Optional)"
                  description="Free Shipping Worldwide ?"
                >
                  <div>
                    <label
                      htmlFor="freeShippingForAll"
                      className="ml-5 flex items-center gap-x-2 cursor-pointer"
                    >
                      <FormField
                        control={form.control}
                        name="freeShippingForAllCountries"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <>
                                <input
                                  type="checkbox"
                                  id="freeShippingForAll"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  hidden
                                />
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  <div>
                    <p className="mt-4 text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                      <Dot className="-me-1" />
                      If not select the countries you want to ship this product
                      to for free
                    </p>
                  </div>
                  <div>
                    {!form.getValues().freeShippingForAllCountries && (
                      <div>
                        <FormField
                          control={form.control}
                          name="freeShippingCountriesIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <MultiSelect
                                  className="!max-w-[800px]"
                                  options={countryOptions} // Array of options, each with `label` and `value`
                                  value={field.value} // Pass the array of objects directly
                                  onChange={(selected: CountryOption[]) => {
                                    field.onChange(selected);
                                  }}
                                  labelledBy="Select"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <p className="mt-4 text-sm text-main-secondary dark:text-gray-400 pb-3 flex">
                          <Dot className="-me-1" />
                          List of countries you offer free shipping for this
                          product :&nbsp;
                          {form.getValues().freeShippingCountriesIds &&
                            form.getValues().freeShippingCountriesIds.length ===
                              0 &&
                            "None"}
                        </p>
                        {/* Free shipping counties */}
                        <div className="flex flex-wrap gap-1">
                          {form
                            .getValues()
                            .freeShippingCountriesIds?.map((country, index) => (
                              <div
                                key={country.id}
                                className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-primary rounded-md gap-x-2"
                              >
                                <span>{country.label}</span>
                                <span
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={() =>
                                    handleDeleteCountryFreeShipping(index)
                                  }
                                >
                                  x
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </InputFieldset>
              )}

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
