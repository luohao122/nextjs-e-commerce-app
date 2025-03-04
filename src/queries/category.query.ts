"use server";

import { currentUser } from "@clerk/nextjs/server";
import { Category } from "@prisma/client";

import { USER_ROLES } from "@/config/constants";
import { db } from "@/lib/db";

/**
 * Upserts a category in the database.
 *
 * This function first verifies that the current user is authenticated and has admin privileges.
 * It then checks that the provided category object contains data. For new category creation,
 * it ensures that the category's name and url are unique (ignoring the current category id).
 * If any conflict is found, an appropriate error is thrown.
 * Finally, it performs an upsert operation (update if exists, or create if not) on the category.
 *
 * @param {Category} category - The category object containing properties like id, name, url, etc.
 * @returns {Promise<Category>} A promise that resolves to the upserted category details.
 * @throws {Error} If the user is unauthenticated, unauthorized, if category data is missing,
 * or if a category with the same name or url already exists (excluding the current category).
 */
export const upsertCategory = async (category: Category) => {
  try {
    // Ensure the current user is authenticated
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    // Verify the user has admin privileges
    if (user.privateMetadata.role !== USER_ROLES.ADMIN) {
      throw new Error("Unauthorized Access: Admin Privileges Required.");
    }

    // Check that category data is provided
    if (!Object.keys(category).length) {
      throw new Error("Missing category data.");
    }

    /**
     * For new categories, ensure that both the name and url are unique.
     * The query looks for any category that has the same name or url but with a different id.
     * This prevents duplicate entries while still allowing updates to the same category.
     */
    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: {
              id: category.id,
            },
          },
        ],
      },
    });

    if (existingCategory) {
      let errorMessage = "";
      if (existingCategory.name === category.name) {
        errorMessage = "A category with the same name already exists.";
      } else if (existingCategory.url === category.url) {
        errorMessage = "A category with the same url already exists.";
      }
      throw new Error(errorMessage);
    }

    // Upsert the category: update it if it exists, otherwise create a new one
    const categoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: category,
      create: category,
    });
    return categoryDetails;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

/**
 * Retrieves all categories from the database.
 *
 * This function uses Prisma's client to fetch all category records,
 * ordering them by their last updated date in descending order.
 * If an error occurs during the fetch, it logs the error and throws a new error with the original error message.
 *
 * @returns {Promise<Category[]>} A promise that resolves with an array of Category objects.
 * @throws {Error} Throws an error if fetching categories fails.
 */
export const getAllCategories = async () => {
  try {
    // Retrieve all categories, ordering by 'updatedAt' in descending order.
    const categories = await db.category.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return categories;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

/**
 * Retrieves all sub-categories from the database based on a given categoryId.
 *
 * This function uses Prisma's client to fetch all sub-categories for a given category,
 * ordering them by their last updated date in descending order.
 * If an error occurs during the fetch, it logs the error and throws a new error with the original error message.
 *
 * @returns {Promise<SubCategory[]>} A promise that resolves with an array of SubCategory objects.
 * @throws {Error} Throws an error if fetching sub-categories fails.
 */
export const getAllSubCategoriesForCategory = async (categoryId: string) => {
  try {
    // Retrieve all sub-categories, ordering by 'updatedAt' in descending order.
    const subCategories = await db.subCategory.findMany({
      where: {
        categoryId,
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
 * Retrieves a category from the database by its unique identifier.
 *
 * This function uses Prisma's `findUnique` method to fetch a category based on the provided categoryId.
 *
 * @param {string} categoryId - The unique identifier of the category.
 * @returns {Promise<Category | null>} A promise that resolves to the found category, or null if no category is found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getCategory = async (categoryId: string) => {
  try {
    // Fetch the category using the provided categoryId.
    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    return category;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

/**
 * Deletes a category from the database by its unique identifier.
 *
 * This function performs several checks before deleting a category:
 * 1. Validates that a categoryId is provided.
 * 2. Ensures the current user is authenticated.
 * 3. Verifies that the authenticated user has admin privileges.
 * 4. Confirms that the category exists in the database.
 * If all checks pass, it deletes the category using Prisma's `delete` method.
 *
 * @param {string} categoryId - The unique identifier of the category to delete.
 * @returns {Promise<Category>} A promise that resolves to the deleted category data.
 * @throws {Error} Throws an error if:
 *  - The categoryId is missing.
 *  - The user is unauthenticated.
 *  - The user lacks admin privileges.
 *  - The category cannot be found.
 *  - The deletion operation fails.
 */
export const deleteCategory = async (categoryId: string) => {
  try {
    // Validate that a categoryId has been provided.
    if (!categoryId) {
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

    // Retrieve the category from the database to verify its existence.
    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new Error("Cannot find category.");
    }

    // Delete the category from the database.
    const response = await db.category.delete({
      where: {
        id: category.id,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};
