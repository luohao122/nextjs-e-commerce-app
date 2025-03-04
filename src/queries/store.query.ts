"use server";

import { currentUser } from "@clerk/nextjs/server";
import { Store } from "@prisma/client";

import { USER_ROLES } from "@/config/constants";
import { db } from "@/lib/db";

/**
 * Upserts a store in the database.
 *
 * This function first verifies that the current user is authenticated and has admin privileges.
 * It then checks that the provided store object contains data. For new store creation,
 * it ensures that the store's name and url are unique (ignoring the current store id).
 * If any conflict is found, an appropriate error is thrown.
 * Finally, it performs an upsert operation (update if exists, or create if not) on the store.
 *
 * @param {Store} store - The store object containing properties like id, name, url, etc.
 * @returns {Promise<Store>} A promise that resolves to the upserted store details.
 * @throws {Error} If the user is unauthenticated, unauthorized, if store data is missing,
 * or if a store with the same name or url already exists (excluding the current store).
 */
export const upsertStore = async (store: Partial<Store>) => {
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
    if (!Object.keys(store).length) {
      throw new Error("Missing store data.");
    }

    /**
     * For new store, ensure that both the name, email, phone and url are unique.
     * The query looks for any store that has the same name, email, phone or url but with a different id.
     * This prevents duplicate entries while still allowing updates to the same store.
     */
    const existingStore = await db.store.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: store.name },
              { email: store.email },
              { phone: store.phone },
              { url: store.url },
            ],
          },
          {
            NOT: {
              id: store.id,
            },
          },
        ],
      },
    });

    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage = "A store with the same name already exists.";
      } else if (existingStore.email === store.email) {
        errorMessage = "A store with the same email already exists.";
      } else if (existingStore.phone === store.phone) {
        errorMessage = "A store with the same phone numbers already exists.";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with the same url already exists.";
      }
      throw new Error(errorMessage);
    }

    // Upsert the store: update it if it exists, otherwise create a new one
    const storeDetails = await db.store.upsert({
      where: {
        id: store.id,
      },
      update: store,
      create: {
        ...store,
        user: {
          connect: { id: user.id },
        },
      },
    });
    return storeDetails;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

/**
 * Retrieves all store from the database.
 *
 * This function uses Prisma's client to fetch all store records,
 * ordering them by their last updated date in descending order.
 * If an error occurs during the fetch, it logs the error and throws a new error with the original error message.
 *
 * @returns {Promise<SubCategory[]>} A promise that resolves with an array of SubCategory objects.
 * @throws {Error} Throws an error if fetching store fails.
 */
export const getAllSubCategories = async () => {
  try {
    // Retrieve all store, ordering by 'updatedAt' in descending order.
    const subCategories = await db.subCategory.findMany({
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return subCategories;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

/**
 * Retrieves a store from the database by its unique identifier.
 *
 * This function uses Prisma's `findUnique` method to fetch a store based on the provided subCategoryId.
 *
 * @param {string} subCategoryId - The unique identifier of the store.
 * @returns {Promise<SubCategory | null>} A promise that resolves to the found store, or null if no store is found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getSubCategory = async (subCategoryId: string) => {
  try {
    // Fetch the store using the provided categoryId.
    const subCategory = await db.subCategory.findUnique({
      where: {
        id: subCategoryId,
      },
    });
    return subCategory;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

/**
 * Retrieves a store from the database by its unique url.
 *
 * This function uses Prisma's `findUnique` method to fetch a store based on the provided url.
 *
 * @param {string} storeUrl - The unique url of the store.
 * @returns {Promise<Store | null>} A promise that resolves to the found store, or null if no store is found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getStoreByUrl = async (storeUrl: string) => {
  try {
    // Fetch the store using the provided storeUrl.
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
    });
    return store;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

/**
 * Deletes a store from the database by its unique identifier.
 *
 * This function performs several checks before deleting a store:
 * 1. Validates that a subCategoryId is provided.
 * 2. Ensures the current user is authenticated.
 * 3. Verifies that the authenticated user has admin privileges.
 * 4. Confirms that the store exists in the database.
 * If all checks pass, it deletes the store using Prisma's `delete` method.
 *
 * @param {string} subCategoryId - The unique identifier of the store to delete.
 * @returns {Promise<SubCategory>} A promise that resolves to the deleted store data.
 * @throws {Error} Throws an error if:
 *  - The subCategoryId is missing.
 *  - The user is unauthenticated.
 *  - The user lacks admin privileges.
 *  - The store cannot be found.
 *  - The deletion operation fails.
 */
export const deleteSubCategory = async (subCategoryId: string) => {
  try {
    // Validate that a subCategoryId has been provided.
    if (!subCategoryId) {
      throw new Error("Missing required parameter.");
    }

    // Ensure the current user is authenticated
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    // Verify the user has admin privileges
    if (user.privateMetadata.role !== USER_ROLES.ADMIN) {
      throw new Error("Unauthorized Access: Admin Privileges Required.");
    }

    // Retrieve the store from the database to verify its existence.
    const subCategory = await db.subCategory.findUnique({
      where: {
        id: subCategoryId,
      },
    });
    if (!subCategory) {
      throw new Error("Cannot find store.");
    }

    // Delete the store from the database.
    const response = await db.subCategory.delete({
      where: {
        id: subCategoryId,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};
