"use server";

import { currentUser } from "@clerk/nextjs/server";
import { SubCategory } from "@prisma/client";

import { USER_ROLES } from "@/config/constants";
import { db } from "@/lib/db";

/**
 * Upserts a sub-category in the database.
 *
 * This function first verifies that the current user is authenticated and has admin privileges.
 * It then checks that the provided sub-category object contains data. For new sub-category creation,
 * it ensures that the sub-category's name and url are unique (ignoring the current sub-category id).
 * If any conflict is found, an appropriate error is thrown.
 * Finally, it performs an upsert operation (update if exists, or create if not) on the sub-category.
 *
 * @param {SubCategory} subcategory - The sub-category object containing properties like id, name, url, etc.
 * @returns {Promise<SubCategory>} A promise that resolves to the upserted sub-category details.
 * @throws {Error} If the user is unauthenticated, unauthorized, if sub-category data is missing,
 * or if a sub-category with the same name or url already exists (excluding the current sub-category).
 */
export const upsertSubCategory = async (subCategory: SubCategory) => {
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

    // Check that sub-category data is provided
    if (!Object.keys(subCategory).length) {
      throw new Error("Missing sub-category data.");
    }

    /**
     * For new sub-categories, ensure that both the name and url are unique.
     * The query looks for any sub-category that has the same name or url but with a different id.
     * This prevents duplicate entries while still allowing updates to the same sub-category.
     */
    const existingSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          {
            NOT: {
              id: subCategory.id,
            },
          },
        ],
      },
    });

    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name) {
        errorMessage = "A sub-category with the same name already exists.";
      } else if (existingSubCategory.url === subCategory.url) {
        errorMessage = "A sub-category with the same url already exists.";
      }
      throw new Error(errorMessage);
    }

    // Upsert the sub-category: update it if it exists, otherwise create a new one
    const subCategoryDetails = await db.subCategory.upsert({
      where: {
        id: subCategory.id,
      },
      update: subCategory,
      create: subCategory,
    });
    return subCategoryDetails;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

/**
 * Retrieves all sub-categories from the database.
 *
 * This function uses Prisma's client to fetch all sub-category records,
 * ordering them by their last updated date in descending order.
 * If an error occurs during the fetch, it logs the error and throws a new error with the original error message.
 *
 * @returns {Promise<SubCategory[]>} A promise that resolves with an array of SubCategory objects.
 * @throws {Error} Throws an error if fetching sub-categories fails.
 */
export const getAllSubCategories = async () => {
  try {
    // Retrieve all sub-categories, ordering by 'updatedAt' in descending order.
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
 * Retrieves a sub-category from the database by its unique identifier.
 *
 * This function uses Prisma's `findUnique` method to fetch a sub-category based on the provided subCategoryId.
 *
 * @param {string} subCategoryId - The unique identifier of the sub-category.
 * @returns {Promise<SubCategory | null>} A promise that resolves to the found sub-category, or null if no sub-category is found.
 * @throws {Error} Throws an error if the database query fails.
 */
export const getSubCategory = async (subCategoryId: string) => {
  try {
    // Fetch the sub-category using the provided categoryId.
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
 * Deletes a sub-category from the database by its unique identifier.
 *
 * This function performs several checks before deleting a sub-category:
 * 1. Validates that a subCategoryId is provided.
 * 2. Ensures the current user is authenticated.
 * 3. Verifies that the authenticated user has admin privileges.
 * 4. Confirms that the sub-category exists in the database.
 * If all checks pass, it deletes the sub-category using Prisma's `delete` method.
 *
 * @param {string} subCategoryId - The unique identifier of the sub-category to delete.
 * @returns {Promise<SubCategory>} A promise that resolves to the deleted sub-category data.
 * @throws {Error} Throws an error if:
 *  - The subCategoryId is missing.
 *  - The user is unauthenticated.
 *  - The user lacks admin privileges.
 *  - The sub-category cannot be found.
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

    // Retrieve the sub-category from the database to verify its existence.
    const subCategory = await db.subCategory.findUnique({
      where: {
        id: subCategoryId,
      },
    });
    if (!subCategory) {
      throw new Error("Cannot find sub-category.");
    }

    // Delete the sub-category from the database.
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

export const getSubCategories = async (
  limit: number | null,
  random: boolean = false
): Promise<SubCategory[]> => {
  enum SortOrder {
    asc = "asc",
    desc = "desc",
  }

  try {
    const queryOptions = {
      take: limit || undefined,
      orderBy: random ? { createdAt: SortOrder.desc } : undefined,
    };

    if (random) {
      const subcategories = await db.$queryRaw<SubCategory[]>`
    SELECT * FROM SubCategory
    ORDER BY RAND()
    LIMIT ${limit || 10} 
    `;
      return subcategories;
    } else {
      const subcategories = await db.subCategory.findMany(queryOptions);
      return subcategories;
    }
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};
