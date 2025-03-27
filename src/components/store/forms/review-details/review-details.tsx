"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import StarRatings from "react-star-ratings";
import { z } from "zod";
import { v4 } from "uuid";

import { PulseLoader } from "react-spinners";

import { ReviewDetailsType, ReviewWithImageType } from "@/types/review.types";
import { VariantInfoType } from "@/types/product-variant.types";
import Select from "@/components/store/ui/select";

import Input from "@/components/store/ui/input";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/store/ui/button";
import ImageUploadStore from "@/components/store/shared/upload-images/upload-images";

import { upsertReview } from "@/queries/review.query";
import { AddReviewSchema } from "@/schemas/add-review-form";
import { useToast } from "@/hooks/use-toast";

import { CLOUDINARY_PRESET } from "@/config/constants";

export default function ReviewDetails({
  productId,
  data,
  variantsInfo,
  setReviews,
  reviews,
}: {
  productId: string;
  data?: ReviewDetailsType;
  variantsInfo: VariantInfoType[];
  reviews: ReviewWithImageType[];
  setReviews: Dispatch<SetStateAction<ReviewWithImageType[]>>;
}) {
  const { toast } = useToast();
  // State for selected Variant
  const [activeVariant, setActiveVariant] = useState<VariantInfoType>(
    variantsInfo[0]
  );

  // Temporary state for images
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setImages] = useState<{ url: string }[]>([]);

  // State for sizes
  const [sizes, setSizes] = useState<{ name: string; value: string }[]>([]);
  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof AddReviewSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(AddReviewSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      variantName: data?.variant || activeVariant.variantName,
      rating: data?.rating || 0,
      size: data?.size || "",
      review: data?.review || "",
      quantity: data?.quantity || undefined,
      images: data?.images || [],
      color: data?.color || "",
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Errors
  const errors = form.formState.errors;

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof AddReviewSchema>) => {
    try {
      const response = await upsertReview(productId, {
        id: data?.id || v4(),
        variant: values.variantName,
        images: values.images,
        quantity: values.quantity,
        rating: values.rating,
        review: values.review,
        size: values.size,
        color: values.color,
      });
      if (response.id) {
        const rev = reviews.filter((rev) => rev.id !== response.id);
        setReviews([...rev, response]);
      }
      toast({
        title: "Review Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);
      toast({ title: error.toString() });
    }
  };

  const variants = variantsInfo.map((v) => ({
    name: v.variantName,
    value: v.variantName,
    image: v.variantImage,
    colors: v.colors.map((c) => c.name).join(","),
  }));

  useEffect(() => {
    form.setValue("size", "");
    const name = form.getValues().variantName;
    const variant = variantsInfo.find((v) => v.variantName === name);
    console.log("variant", variant);
    if (variant) {
      const sizesData = variant.sizes.map((s) => ({
        name: s.size,
        value: s.size,
      }));
      setActiveVariant(variant);
      if (sizes) setSizes(sizesData);
      form.setValue(
        "color",
        variant.colors.map((color) => color.name).join(",")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues().variantName]);

  return (
    <div>
      <div className="p-4 bg-[#f5f5f5] rounded-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col space-y-4">
              {/* Title */}
              <div className="pt-4">
                <h1 className="font-bold text-2xl">Add a review</h1>
              </div>
              {/* Form items */}
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-x-2">
                          <StarRatings
                            rating={field.value}
                            starRatedColor="#FFD804"
                            starEmptyColor="#e2dfdf"
                            numberOfStars={5}
                            starDimension="19px"
                            changeRating={field.onChange}
                            starSpacing="2px"
                          />
                          <span>
                            ( {form.getValues().rating.toFixed(1)} out of 5.0)
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="w-full flex flex-wrap gap-x-4">
                  <div className="flex items-center flex-wrap gap-2">
                    <FormField
                      control={form.control}
                      name="variantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              name={field.name}
                              value={field.value}
                              onChange={field.onChange}
                              options={variants}
                              placeholder="Select product"
                              subPlaceholder="Please select a product"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            options={sizes}
                            placeholder="Select size"
                            subPlaceholder="Please select a size"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            name="quantity"
                            type="number"
                            placeholder="Quantity (Optional)"
                            onChange={(event) => {
                              field.onChange(event.target.value.toString());
                            }}
                            value={field.value ? field.value.toString() : ""} // Handle undefined gracefully
                          />
                          {/* <Input
                            type="number"
                            step={1}
                            placeholder="Quantity (Optional)"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          /> */}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          className="min-h-32 p-4 w-full rounded-xl focus:outline-none ring-1 ring-[transparent] focus:ring-[#11BE86]"
                          placeholder="Write your review..."
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <ImageUploadStore
                          uploadPreset={CLOUDINARY_PRESET}
                          value={field.value.map((image) => image.url)}
                          disabled={isLoading}
                          onChange={(url) => {
                            setImages((prevImages) => {
                              const updatedImages = [...prevImages, { url }];
                              if (updatedImages.length <= 3) {
                                field.onChange(updatedImages);
                                return updatedImages;
                              } else {
                                return prevImages;
                              }
                            });
                          }}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                          maxImages={3}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 text-destructive">
                {errors.rating && <p>{errors.rating.message}</p>}
                {errors.size && <p>{errors.size.message}</p>}
                {errors.review && <p>{errors.review.message}</p>}
              </div>
              <div className="w-full flex justify-end">
                <Button type="submit" className="w-36 h-12">
                  {isLoading ? (
                    <PulseLoader size={5} color="#fff" />
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
