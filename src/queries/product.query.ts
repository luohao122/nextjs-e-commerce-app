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
      slug: variantSlug,
      isSale: product.isSale,
      sku: product.sku,
      keywords: product.keywords.join(","),
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
