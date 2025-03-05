"use server";

import { currentUser } from "@clerk/nextjs/server";
import slugify from "slugify";

import { ProductWithVariantType } from "@/components/dashboard/forms/product-details/product-details.types";
import { USER_ROLES } from "@/config/constants";
import { db } from "@/lib/db";

import { generateUniqueSlug } from "@/lib/utils";

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
    const commonProductData = {
      name: product.name,
      description: product.description,
      slug: productSlug,
      brand: product.brand,
      questions: {
        create: product.questions.map((question) => ({
          question: question.question,
          answer: question.answer,
        })),
      },
      specs: {
        create: product.product_specs.map((spec) => ({
          value: spec.value,
          name: spec.name,
        })),
      },
      store: {
        connect: { id: store.id },
      },
      category: {
        connect: { id: product.categoryId },
      },
      subCategory: {
        connect: { id: product.subCategoryId || "" },
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    const commonVariantData = {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      variantImage: product.variantImage,
      slug: variantSlug,
      isSale: product.isSale,
      saleEndDate: product.isSale ? product.saleEndDate : "",
      sku: product.sku,
      keywords: product.keywords.join(","),
      specs: {
        create: product.variant_specs.map((spec) => ({
          value: spec.value,
          name: spec.name,
        })),
      },
      images: {
        create: product.images.map((image) => ({
          url: image.url,
          alt: image.url.split("/").pop() || "",
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
          quantity: size.quantity,
          price: size.price,
          discount: size.discount,
        })),
      },
      seoTitle: "",
      seoDescription: "",
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    // If product exists, create a variant
    if (existingProduct) {
      const variantData = {
        ...commonVariantData,
        product: {
          connect: { id: product.productId },
        },
      };
      return await db.productVariant.create({ data: variantData });
    } else {
      const productData = {
        ...commonProductData,
        id: product.productId,
        variants: {
          create: [
            {
              id: product.variantId,
              ...commonVariantData,
            },
          ],
        },
      };

      return await db.product.create({ data: productData });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
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
