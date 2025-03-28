"use server";

import { currentUser } from "@clerk/nextjs/server";
import slugify from "slugify";
import { getCookie } from "cookies-next/server";

import { cookies } from "next/headers";
import { Store } from "@prisma/client";

import { ProductWithVariantType } from "@/components/dashboard/forms/product-details/product-details.types";
import { USER_ROLES } from "@/config/constants";
import { db } from "@/lib/db";

import { generateUniqueSlug } from "@/lib/utils";
import {
  ProductPageType,
  VariantImage,
  VariantSimplified,
} from "@/types/product.types";
import {
  FreeShippingWithCountriesType,
  ProductShippingDetailsType,
} from "@/types/shipping.types";

import { Country, RatingStatisticsType, SortOrder } from "@/types/types";

export const upsertProduct = async (
  product: ProductWithVariantType,
  storeUrl: string
) => {
  try {
    // Ensure the current user is authenticated
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    // Verify the user has seller privileges
    if (user.privateMetadata.role !== USER_ROLES.SELLER) {
      throw new Error("Unauthorized Access: Seller Privileges Required.");
    }

    // Check that store data is provided
    if (!Object.keys(product).length) {
      throw new Error("Missing product data.");
    }

    // Check that store url is provided
    if (!storeUrl.length) {
      throw new Error("Missing store url.");
    }

    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });
    if (!store) {
      throw new Error("No stores found.");
    }

    const existingProduct = await db.product.findUnique({
      where: {
        id: product.productId,
      },
    });

    console.log(product);

    // Check if the variant already exists
    const existingVariant = await db.productVariant.findUnique({
      where: { id: product.variantId },
    });

    if (existingProduct) {
      if (existingVariant) {
        // Update existing variant and product
        await handleUpdateProductAndVariant(product);
      } else {
        // Create new variant
        await handleCreateVariant(product);
      }
    } else {
      // Create new product and variant
      await handleProductCreate(product, store.id);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const handleProductCreate = async (
  product: ProductWithVariantType,
  storeId: string
) => {
  // Generate unique slugs for product and variant
  const productSlug = await generateUniqueSlug(
    slugify(product.name, {
      replacement: "-",
      lower: true,
      trim: true,
    }),
    "product"
  );

  const variantSlug = await generateUniqueSlug(
    slugify(product.variantName, {
      replacement: "-",
      lower: true,
      trim: true,
    }),
    "productVariant"
  );

  const productData = {
    id: product.productId,
    name: product.name,
    description: product.description,
    slug: productSlug,
    store: { connect: { id: storeId } },
    category: { connect: { id: product.categoryId } },
    subCategory: { connect: { id: product.subCategoryId } },
    offerTag: { connect: { id: product.offerTagId } },
    brand: product.brand,
    specs: {
      create: product.product_specs.map((spec) => ({
        name: spec.name,
        value: spec.value,
      })),
    },
    questions: {
      create: product.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    },
    variants: {
      create: [
        {
          id: product.variantId,
          variantName: product.variantName,
          variantDescription: product.variantDescription,
          slug: variantSlug,
          variantImage: product.variantImage,
          sku: product.sku,
          weight: product.weight,
          keywords: product.keywords.join(","),
          isSale: product.isSale,
          saleEndDate: product.saleEndDate,
          images: {
            create: product.images.map((img) => ({
              url: img.url,
            })),
          },
          colors: {
            create: product.colors.map((color) => ({
              name: color.color,
            })),
          },
          sizes: {
            create: product.sizes.map((size) => ({
              size: size.size,
              price: size.price,
              quantity: size.quantity,
              discount: size.discount,
            })),
          },
          specs: {
            create: product.variant_specs.map((spec) => ({
              name: spec.name,
              value: spec.value,
            })),
          },
          seoTitle: "",
          seoDescription: "",
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      ],
    },
    shippingFeeMethod: product.shippingFeeMethod,
    freeShippingForAllCountries: product.freeShippingForAllCountries,
    freeShipping: product.freeShippingForAllCountries
      ? undefined
      : product.freeShippingCountriesIds &&
        product.freeShippingCountriesIds.length > 0
      ? {
          create: {
            eligibleCountries: {
              create: product.freeShippingCountriesIds.map((country) => ({
                country: { connect: { id: country.value } },
              })),
            },
          },
        }
      : undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  const new_product = await db.product.create({ data: productData });
  return new_product;
};

const handleCreateVariant = async (product: ProductWithVariantType) => {
  const variantSlug = await generateUniqueSlug(
    slugify(product.variantName, {
      replacement: "-",
      lower: true,
      trim: true,
    }),
    "productVariant"
  );

  const variantData = {
    id: product.variantId,
    productId: product.productId,
    variantName: product.variantName,
    variantDescription: product.variantDescription,
    slug: variantSlug,
    isSale: product.isSale,
    saleEndDate: product.isSale ? product.saleEndDate : "",
    sku: product.sku,
    keywords: product.keywords.join(","),
    weight: product.weight,
    variantImage: product.variantImage,
    images: {
      create: product.images.map((img) => ({
        url: img.url,
      })),
    },
    colors: {
      create: product.colors.map((color) => ({
        name: color.color,
      })),
    },
    sizes: {
      create: product.sizes.map((size) => ({
        size: size.size,
        price: size.price,
        quantity: size.quantity,
        discount: size.discount,
      })),
    },
    specs: {
      create: product.variant_specs.map((spec) => ({
        name: spec.name,
        value: spec.value,
      })),
    },
    seoTitle: "",
    seoDescription: "",
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  const new_variant = await db.productVariant.create({ data: variantData });
  return new_variant;
};

const handleUpdateProductAndVariant = async (
  product: ProductWithVariantType
) => {
  // Generate new unique slugs in case the product or variant name changed
  const newProductSlug = await generateUniqueSlug(
    slugify(product.name, { replacement: "-", lower: true, trim: true }),
    "product"
  );
  const newVariantSlug = await generateUniqueSlug(
    slugify(product.variantName, { replacement: "-", lower: true, trim: true }),
    "productVariant"
  );

  // Update the product
  await db.product.update({
    where: { id: product.productId },
    data: {
      name: product.name,
      description: product.description,
      slug: newProductSlug,
      brand: product.brand,
      category: { connect: { id: product.categoryId } },
      subCategory: { connect: { id: product.subCategoryId } },
      offerTag: { connect: { id: product.offerTagId } },
      shippingFeeMethod: product.shippingFeeMethod,
      freeShippingForAllCountries: product.freeShippingForAllCountries,
      updatedAt: product.updatedAt,
      // Update product specs by removing existing ones and creating new ones
      specs: {
        deleteMany: {},
        create: product.product_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      // Update questions similarly
      questions: {
        deleteMany: {},
        create: product.questions.map((q) => ({
          question: q.question,
          answer: q.answer,
        })),
      },
      // Optionally update free shipping details if needed
      freeShipping: product.freeShippingForAllCountries
        ? { delete: true }
        : product.freeShippingCountriesIds &&
          product.freeShippingCountriesIds.length > 0
        ? {
            upsert: {
              update: {
                eligibleCountries: {
                  deleteMany: {},
                  create: product.freeShippingCountriesIds.map((country) => ({
                    country: { connect: { id: country.value } },
                  })),
                },
              },
              create: {
                eligibleCountries: {
                  create: product.freeShippingCountriesIds.map((country) => ({
                    country: { connect: { id: country.value } },
                  })),
                },
              },
            },
          }
        : undefined,
    },
  });

  // Update the variant
  await db.productVariant.update({
    where: { id: product.variantId },
    data: {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      slug: newVariantSlug,
      isSale: product.isSale,
      saleEndDate: product.isSale ? product.saleEndDate : "",
      sku: product.sku,
      keywords: product.keywords.join(","),
      weight: product.weight,
      variantImage: product.variantImage,
      updatedAt: product.updatedAt,
      // Update variant images by deleting all existing ones and adding the new set
      images: {
        deleteMany: {},
        create: product.images.map((img) => ({
          url: img.url,
        })),
      },
      // Update variant colors
      colors: {
        deleteMany: {},
        create: product.colors.map((color) => ({
          name: color.color,
        })),
      },
      // Update variant sizes
      sizes: {
        deleteMany: {},
        create: product.sizes.map((size) => ({
          size: size.size,
          price: size.price,
          quantity: size.quantity,
          discount: size.discount,
        })),
      },
      // Update variant specs
      specs: {
        deleteMany: {},
        create: product.variant_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
    },
  });
};

export const getProductMainDataById = async (productId: string) => {
  try {
    // Check that store data is provided
    if (!Object.keys(productId).length) {
      throw new Error("Missing product id.");
    }

    const existingProduct = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        questions: true,
        specs: true,
      },
    });

    if (!existingProduct) {
      return null;
    }

    return {
      productId: existingProduct.id,
      name: existingProduct.name,
      description: existingProduct.description,
      brand: existingProduct.brand,
      categoryId: existingProduct.categoryId,
      storeId: existingProduct.storeId,
      subCategoryId: existingProduct.subCategoryId,
      offerTagId: existingProduct.offerTagId || undefined,
      shippingFeeMethod: existingProduct.shippingFeeMethod,
      questions: existingProduct.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
      product_specs: existingProduct.specs.map((spec) => ({
        name: spec.name,
        value: spec.value,
      })),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllStoreProducts = async (storeUrl: string) => {
  const store = await db.store.findUnique({
    where: {
      url: storeUrl,
    },
  });

  if (!store) {
    throw new Error("Please provide a valid store URL.");
  }

  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      category: true,
      subCategory: true,
      offerTag: true,
      variants: {
        include: {
          images: true,
          colors: true,
          sizes: true,
        },
      },
      store: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  return products;
};

/**
 * Deletes a product from the database by its unique identifier.
 *
 * This function performs several checks before deleting a product:
 * 1. Validates that a productId is provided.
 * 2. Ensures the current user is authenticated.
 * 3. Verifies that the authenticated user has seller privileges.
 * 4. Confirms that the product exists in the database.
 * If all checks pass, it deletes the product using Prisma's `delete` method.
 *
 * @param {string} productId - The unique identifier of the product to delete.
 * @returns {Promise<Category>} A promise that resolves to the deleted product data.
 * @throws {Error} Throws an error if:
 *  - The productId is missing.
 *  - The user is unauthenticated.
 *  - The user lacks admin privileges.
 *  - The product cannot be found.
 *  - The deletion operation fails.
 */
export const deleteProduct = async (productId: string) => {
  try {
    // Validate that a productId has been provided.
    if (!productId) {
      throw new Error("Missing required parameter.");
    }

    // Ensure the current user is authenticated
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    // Verify the user has admin privileges
    if (user.privateMetadata.role !== USER_ROLES.SELLER) {
      throw new Error("Unauthorized Access: Seller Privileges Required.");
    }

    // Retrieve the category from the database to verify its existence.
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Cannot find product.");
    }

    // Delete the product from the database.
    const response = await db.product.delete({
      where: {
        id: product.id,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

const getStoreFollowersCount = async (storeId: string) => {
  const storeFollwersCount = await db.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });
  return storeFollwersCount?._count.followers || 0;
};

const checkIfUserFollowingStore = async (
  storeId: string,
  userId: string | undefined
) => {
  let isUserFollowingStore = false;
  if (userId) {
    const storeFollowersInfo = await db.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        followers: {
          where: {
            id: userId, // Check if this user is following the store
          },
          select: { id: true }, // Select the user id if followin
        },
      },
    });
    if (storeFollowersInfo && storeFollowersInfo.followers.length > 0) {
      isUserFollowingStore = true;
    }
  }

  return isUserFollowingStore;
};

export const getShippingDetails = async (
  shippingFeeMethod: string,
  userCountry: { name: string; code: string; city: string },
  store: Store,
  freeShipping: FreeShippingWithCountriesType | null
) => {
  let shippingDetails = {
    shippingFeeMethod,
    shippingService: "",
    shippingFee: 0,
    extraShippingFee: 0,
    deliveryTimeMin: 0,
    deliveryTimeMax: 0,
    returnPolicy: "",
    countryCode: userCountry.code,
    countryName: userCountry.name,
    city: userCountry.city,
    isFreeShipping: false,
  };
  const country = await db.country.findUnique({
    where: {
      name: userCountry.name,
      code: userCountry.code,
    },
  });

  if (country) {
    // Retrieve shipping rate for the country
    const shippingRate = await db.shippingRate.findFirst({
      where: {
        countryId: country.id,
        storeId: store.id,
      },
    });

    const returnPolicy = shippingRate?.returnPolicy || store.returnPolicy;
    const shippingService =
      shippingRate?.shippingService || store.defaultShippingService;
    const shippingFeePerItem =
      shippingRate?.shippingFeePerItem || store.defaultShippingFeePerItem;
    const shippingFeeForAdditionalItem =
      shippingRate?.shippingFeeForAdditionalItem ||
      store.defaultShippingFeeForAdditionalItem;
    const shippingFeePerKg =
      shippingRate?.shippingFeePerKg || store.defaultShippingFeePerKg;
    const shippingFeeFixed =
      shippingRate?.shippingFeeFixed || store.defaultShippingFeeFixed;
    const deliveryTimeMin =
      shippingRate?.deliveryTimeMin || store.defaultDeliveryTimeMin;
    const deliveryTimeMax =
      shippingRate?.deliveryTimeMax || store.defaultDeliveryTimeMax;

    // Check for free shipping
    if (freeShipping) {
      const free_shipping_countries = freeShipping.eligibleCountries;
      const check_free_shipping = free_shipping_countries.find(
        (c) => c.countryId === country.id
      );
      if (check_free_shipping) {
        shippingDetails.isFreeShipping = true;
      }
    }
    shippingDetails = {
      shippingFeeMethod,
      shippingService: shippingService,
      shippingFee: 0,
      extraShippingFee: 0,
      deliveryTimeMin,
      deliveryTimeMax,
      returnPolicy,
      countryCode: userCountry.code,
      countryName: userCountry.name,
      city: userCountry.city,
      isFreeShipping: shippingDetails.isFreeShipping,
    };

    const { isFreeShipping } = shippingDetails;
    switch (shippingFeeMethod) {
      case "ITEM":
        shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeePerItem;
        shippingDetails.extraShippingFee = isFreeShipping
          ? 0
          : shippingFeeForAdditionalItem;
        break;

      case "WEIGHT":
        shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeePerKg;
        break;

      case "FIXED":
        shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeeFixed;
        break;

      default:
        break;
    }

    return shippingDetails;
  }
  return false;
};

export const getProductFilteredReviews = async (
  productId: string,
  filters: { rating?: number; hasImages?: boolean },
  sort: { orderBy: "latest" | "oldest" | "highest" } | undefined,
  page: number = 1,
  pageSize: number = 4
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviewFilter: any = {
    productId,
  };

  // Apply rating filter if provided
  if (filters.rating) {
    const rating = filters.rating;
    reviewFilter.rating = {
      in: [rating, rating + 0.5],
    };
  }

  // Apply image filter if provided
  if (filters.hasImages) {
    reviewFilter.images = {
      some: {},
    };
  }

  // Set sorting order using local SortOrder type
  const sortOption: { createdAt?: SortOrder; rating?: SortOrder } =
    sort && sort.orderBy === "latest"
      ? { createdAt: "desc" }
      : sort && sort.orderBy === "oldest"
      ? { createdAt: "asc" }
      : { rating: "desc" };

  // Calculate pagination parameters
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  // Fetch reviews from the database
  const reviews = await db.review.findMany({
    where: reviewFilter,
    include: {
      images: true,
      user: true,
    },
    orderBy: sortOption,
    skip, // Skip records for pagination
    take, // Take records for pagination
  });

  return reviews;
};

export const getRatingStatistics = async (productId: string) => {
  const ratingStats = await db.review.groupBy({
    by: ["rating"],
    where: { productId },
    _count: {
      rating: true,
    },
  });
  const totalReviews = ratingStats.reduce(
    (sum, stat) => sum + stat._count.rating,
    0
  );

  const ratingCounts = Array(5).fill(0);

  ratingStats.forEach((stat) => {
    const rating = Math.floor(stat.rating);
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1] = stat._count.rating;
    }
  });

  return {
    ratingStatistics: ratingCounts.map((count, index) => ({
      rating: index + 1,
      numReviews: count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    })),
    reviewsWithImagesCount: await db.review.count({
      where: {
        productId,
        images: { some: {} },
      },
    }),
    totalReviews,
  };
};

export const getProducts = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortBy: string = "",
  page: number = 1,
  pageSize: number = 10
) => {
  const currentPage = page;
  const limit = pageSize;
  const skip = (currentPage - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    AND: [],
  };

  if (filters.store) {
    const store = await db.store.findUnique({
      where: {
        url: filters.store,
      },
      select: {
        id: true,
      },
    });
    if (store) {
      whereClause.AND.push({ storeId: store.id });
    }
  }

  if (filters.category) {
    const category = await db.category.findUnique({
      where: {
        url: filters.category,
      },
      select: { id: true },
    });
    if (category) {
      whereClause.AND.push({ categoryId: category.id });
    }
  }

  // Apply subCategory filter (using subCategory URL)
  if (filters.subCategory) {
    const subCategory = await db.subCategory.findUnique({
      where: {
        url: filters.subCategory,
      },
      select: { id: true },
    });
    if (subCategory) {
      whereClause.AND.push({ subCategoryId: subCategory.id });
    }
  }

  // Apply size filter (using array of sizes)
  if (filters.size && Array.isArray(filters.size)) {
    whereClause.AND.push({
      variants: {
        some: {
          sizes: {
            some: {
              size: {
                in: filters.size,
              },
            },
          },
        },
      },
    });
  }

  // Apply Offer filter (using offer URL)
  if (filters.offer) {
    const offer = await db.offerTag.findUnique({
      where: {
        url: filters.offer,
      },
      select: { id: true },
    });
    if (offer) {
      whereClause.AND.push({ offerTagId: offer.id });
    }
  }

  // Apply search filter (search term in product name or description)
  if (filters.search) {
    whereClause.AND.push({
      OR: [
        {
          name: { contains: filters.search },
        },
        {
          description: { contains: filters.search },
        },
        {
          variants: {
            some: {
              variantName: { contains: filters.search },
              variantDescription: { contains: filters.search },
            },
          },
        },
      ],
    });
  }

  const products = await db.product.findMany({
    where: whereClause,
    take: limit,
    skip,
    include: {
      variants: {
        include: {
          sizes: true,
          images: true,
          colors: true,
        },
      },
    },
  });

  const productsWithFilteredVariants = products.map((product) => {
    const filteredVariants = product.variants;
    const variants: VariantSimplified[] = filteredVariants.map((variant) => ({
      variantId: variant.id,
      variantSlug: variant.slug,
      variantName: variant.variantName,
      images: variant.images,
      sizes: variant.sizes,
    }));

    const variantImages: VariantImage[] = filteredVariants.map((variant) => ({
      url: `/product/${product.slug}/${variant.slug}`,
      image: variant.variantImage
        ? variant.variantImage
        : variant.images[0].url,
    }));

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      rating: product.rating,
      sales: product.sales,
      variants,
      variantImages,
    };
  });

  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products: productsWithFilteredVariants,
    totalPages,
    currentPage,
    pageSize,
    totalCount,
  };
};

export const retrieveProductDetails = async (
  productSlug: string,
  variantSlug: string
) => {
  const product = await db.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      category: true,
      subCategory: true,
      offerTag: true,
      store: true,
      specs: true,
      questions: true,
      reviews: {
        include: {
          images: true,
          user: true,
        },
        take: 4,
      },
      freeShipping: {
        include: {
          eligibleCountries: true,
        },
      },
      variants: {
        where: {
          slug: variantSlug,
        },
        include: {
          images: true,
          colors: true,
          sizes: true,
          specs: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  const variantsInfo = await db.productVariant.findMany({
    where: {
      productId: product.id,
    },
    include: {
      images: true,
      sizes: true,
      colors: true,
      product: {
        select: { slug: true },
      },
    },
  });

  return {
    ...product,
    variantsInfo: variantsInfo.map((variant) => ({
      variantName: variant.variantName,
      variantSlug: variant.slug,
      variantImage: variant.variantImage,
      variantUrl: `/product/${productSlug}/${variant.slug}`,
      images: variant.images,
      sizes: variant.sizes,
      colors: variant.colors,
    })),
  };
};

const formatProductResponse = (
  product: ProductPageType,
  shippingDetails: ProductShippingDetailsType,
  storeFollwersCount: number,
  isUserFollowingStore: boolean,
  ratingStatistics: RatingStatisticsType
) => {
  if (!product) {
    return;
  }

  const variant = product.variants[0];
  const { store, category, subCategory, offerTag, questions, reviews } =
    product;
  const { images, colors, sizes } = variant;

  return {
    productId: product.id,
    variantId: variant.id,
    productSlug: product.slug,
    variantSlug: variant.slug,
    name: product.name,
    description: product.description,
    variantName: variant.variantName,
    variantDescription: variant.variantDescription,
    images,
    category,
    subCategory,
    offerTag,
    isSale: variant.isSale,
    saleEndDate: variant.saleEndDate,
    brand: product.brand,
    sku: variant.sku,
    weight: variant.weight,
    variantImage: variant.variantImage,
    store: {
      id: store.id,
      url: store.url,
      name: store.name,
      logo: store.logo,
      followersCount: storeFollwersCount,
      isUserFollowingStore,
    },
    colors,
    sizes,
    specs: {
      product: product.specs,
      variant: variant.specs,
    },
    questions,
    rating: product.rating,
    reviews,
    reviewsStatistics: ratingStatistics,
    shippingDetails,
    relatedProducts: [],
    variantInfo: product.variantsInfo,
  };
};

const getUserCountry = async () => {
  const userCountryCookie = (await getCookie("userCountry", { cookies })) || "";
  const defaultCountry = { name: "United States", code: "US" };

  try {
    const parsedCountry = JSON.parse(userCountryCookie);
    if (
      parsedCountry &&
      typeof parsedCountry === "object" &&
      "name" in parsedCountry &&
      "code" in parsedCountry
    ) {
      return parsedCountry;
    }
    return defaultCountry;
  } catch (error) {
    console.error("Failed to parse userCountryCookie", error);
  }
};

export const getProductPageData = async (
  productSlug: string,
  variantSlug: string
) => {
  const user = await currentUser();
  // Retrieve product variant details from the database
  const product = await retrieveProductDetails(productSlug, variantSlug);
  if (!product) return;

  const userCountry = await getUserCountry();
  const productShippingDetails = await getShippingDetails(
    product.shippingFeeMethod,
    userCountry,
    product.store,
    product.freeShipping
  );
  const storeFollwersCount = await getStoreFollowersCount(product.storeId);

  // Check if user is following store
  const isUserFollowingStore = await checkIfUserFollowingStore(
    product.storeId,
    user?.id
  );

  const ratingStatistics = await getRatingStatistics(product.id);

  return formatProductResponse(
    product,
    productShippingDetails,
    storeFollwersCount,
    isUserFollowingStore,
    ratingStatistics
  );
};

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        slug,
      },
      include: {
        variants: true,
      },
    });
    return product;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

export const getDeliveryDetailsForStoreByCountry = async (
  storeId: string,
  countryId: string
) => {
  // Get shipping rate
  const shippingRate = await db.shippingRate.findFirst({
    where: {
      countryId,
      storeId,
    },
  });

  let storeDetails;
  if (!shippingRate) {
    storeDetails = await db.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        defaultShippingService: true,
        defaultDeliveryTimeMin: true,
        defaultDeliveryTimeMax: true,
      },
    });
  }

  const shippingService = shippingRate
    ? shippingRate.shippingService
    : storeDetails?.defaultShippingService;

  const deliveryTimeMin = shippingRate
    ? shippingRate.deliveryTimeMin
    : storeDetails?.defaultDeliveryTimeMin;

  const deliveryTimeMax = shippingRate
    ? shippingRate.deliveryTimeMax
    : storeDetails?.defaultDeliveryTimeMax;

  return {
    shippingService,
    deliveryTimeMin,
    deliveryTimeMax,
  };
};

export const getProductShippingFee = async (
  shippingFeeMethod: string,
  userCountry: Country,
  store: Store,
  freeShipping: FreeShippingWithCountriesType | null,
  weight: number,
  quantity: number
) => {
  // Fetch country information based on userCountry.name and userCountry.code
  const country = await db.country.findUnique({
    where: {
      name: userCountry.name,
      code: userCountry.code,
    },
  });

  if (country) {
    // Check if the user qualifies for free shipping
    if (freeShipping) {
      const free_shipping_countries = freeShipping.eligibleCountries;
      const isEligableForFreeShipping = free_shipping_countries.some(
        (c) => c.countryId === country.name
      );
      if (isEligableForFreeShipping) {
        return 0; // Free shipping
      }
    }

    // Fetch shipping rate from the database for the given store and country
    const shippingRate = await db.shippingRate.findFirst({
      where: {
        countryId: country.id,
        storeId: store.id,
      },
    });

    // Destructure the shippingRate with defaults
    const {
      shippingFeePerItem = store.defaultShippingFeePerItem,
      shippingFeeForAdditionalItem = store.defaultShippingFeeForAdditionalItem,
      shippingFeePerKg = store.defaultShippingFeePerKg,
      shippingFeeFixed = store.defaultShippingFeeFixed,
    } = shippingRate || {};

    // Calculate the additional quantity (excluding the first item)
    const additionalItemsQty = quantity - 1;

    // Log values for debugging (remove in production)
    /*
    console.log("Shipping fee details:");
    console.log("Per Item Fee:", shippingFeePerItem);
    console.log("Additional Item Fee:", shippingFeeForAdditionalItem);
    console.log("Per Kg Fee:", shippingFeePerKg);
    */

    // Define fee calculation methods in a map (using functions)
    const feeCalculators: Record<string, () => number> = {
      ITEM: () =>
        shippingFeePerItem + shippingFeeForAdditionalItem * additionalItemsQty,
      WEIGHT: () => shippingFeePerKg * weight * quantity,
      FIXED: () => shippingFeeFixed,
    };

    // Check if the fee calculation method exists and calculate the fee
    const calculateFee = feeCalculators[shippingFeeMethod];
    if (calculateFee) {
      return calculateFee(); // Execute the corresponding calculation
    }

    // If no valid shipping method is found, return 0
    return 0;
  }

  // Return 0 if the country is not found
  return 0;
};

export const getProductsByIds = async (
  ids: string[],
  page: number = 1,
  pageSize: number = 10
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ products: any; totalPages: number }> => {
  // Check if ids array is empty
  if (!ids || ids.length === 0) {
    throw new Error("Ids are undefined");
  }

  // Default values for page and pageSize
  const currentPage = page;
  const limit = pageSize;
  const skip = (currentPage - 1) * limit;

  try {
    // Query the database for products with the specified ids
    const variants = await db.productVariant.findMany({
      where: {
        id: {
          in: ids, // Filter products whose idds are in the provided array
        },
      },
      select: {
        id: true,
        variantName: true,
        slug: true,
        images: {
          select: {
            url: true,
          },
        },
        sizes: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            rating: true,
            sales: true,
          },
        },
      },
      take: limit,
      skip: skip,
    });

    const new_products = variants.map((variant) => ({
      id: variant.product.id,
      slug: variant.product.slug,
      name: variant.product.name,
      rating: variant.product.rating,
      sales: variant.product.sales,
      variants: [
        {
          variantId: variant.id,
          variantName: variant.variantName,
          variantSlug: variant.slug,
          images: variant.images,
          sizes: variant.sizes,
        },
      ],
      variantImages: [],
    }));

    // Return products sorted in the order of ids provided
    const ordered_products = ids
      .map((id) =>
        new_products.find((product) => product.variants[0].variantId === id)
      )
      .filter(Boolean); // Filter out undefined values

    const allProducts = await db.productVariant.count({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const totalPages = Math.ceil(allProducts / pageSize);

    return {
      products: ordered_products,
      totalPages,
    };
  } catch (error) {
    console.error("Error retrieving products by ids:", error);
    throw new Error("Failed to fetch products. Please try again.");
  }
};
