"use server";

import { currentUser } from "@clerk/nextjs/server";
import { ShippingRate, Store } from "@prisma/client";

import { USER_ROLES } from "@/config/constants";
import { db } from "@/lib/db";
import { StoreDefaultShippingType } from "@/components/dashboard/forms/store-default-shipping-details/store-default-shipping-details.types";

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

export const getStoreDefaultShippingDetails = async (storeUrl: string) => {
  try {
    if (!storeUrl) {
      throw new Error("Store URL is required.");
    }
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
      select: {
        defaultShippingService: true,
        defaultShippingFeePerItem: true,
        defaultShippingFeeForAdditionalItem: true,
        defaultShippingFeePerKg: true,
        defaultDeliveryTimeMin: true,
        defaultDeliveryTimeMax: true,
        defaultShippingFeeFixed: true,
        returnPolicy: true,
      },
    });

    if (!store) {
      throw new Error("Store not found.");
    }

    return store;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

export const updateStoreDefaultShippingDetails = async (
  storeUrl: string,
  details: StoreDefaultShippingType
) => {
  try {
    if (!storeUrl) {
      throw new Error("Store URL is required.");
    }

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
    if (!Object.keys(details).length) {
      throw new Error("No shipping details provided to update");
    }

    const check_ownership = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });
    if (!check_ownership) {
      throw new Error("You are not the owner of the store!");
    }

    const updatedStore = await db.store.update({
      where: {
        url: storeUrl,
        userId: user.id,
      },
      data: details,
    });

    return updatedStore;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

export const getStoreShippingRates = async (storeUrl: string) => {
  try {
    if (!storeUrl) {
      throw new Error("Store URL is required.");
    }

    // Ensure the current user is authenticated
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    // Verify the user has seller privileges
    if (user.privateMetadata.role !== USER_ROLES.SELLER) {
      throw new Error("Unauthorized Access: Seller Privileges Required.");
    }

    const foundStore = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });
    if (!foundStore) {
      throw new Error("You are not the owner of the store!");
    }

    const countries = await db.country.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const shippingRates = await db.shippingRate.findMany({
      where: {
        storeId: foundStore.id,
      },
    });

    const rateMap = new Map();
    for (const rate of shippingRates) {
      rateMap.set(rate.countryId, rate);
    }

    const result = countries.map((country) => ({
      countryId: country.id,
      countryName: country.name,
      shippingRate: rateMap.get(country.id) || null,
    }));
    return result;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

export const upsertShippingRate = async (
  storeUrl: string,
  shippingRate: ShippingRate
) => {
  try {
    if (!storeUrl) {
      throw new Error("Store URL is required.");
    }

    // Ensure the current user is authenticated
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    // Verify the user has seller privileges
    if (user.privateMetadata.role !== USER_ROLES.SELLER) {
      throw new Error("Unauthorized Access: Seller Privileges Required.");
    }

    const foundStore = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });
    if (!foundStore) {
      throw new Error("You are not the owner of the store!");
    }

    if (!Object.keys(shippingRate).length) {
      throw new Error("Please provide shipping rate data.");
    }

    if (!shippingRate.countryId) {
      throw new Error("Please provide a valid country ID.");
    }

    const shippingRateDetails = await db.shippingRate.upsert({
      where: {
        id: shippingRate.id,
      },
      update: { ...shippingRate, storeId: foundStore.id },
      create: { ...shippingRate, storeId: foundStore.id },
    });
    return shippingRateDetails;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

export const getStoreOrders = async (storeUrl: string) => {
  try {
    if (!storeUrl) {
      throw new Error("Store URL is required.");
    }

    // Ensure the current user is authenticated
    const user = await currentUser();
    if (!user) {
      throw new Error("Unauthenticated");
    }

    // Verify the user has seller privileges
    if (user.privateMetadata.role !== USER_ROLES.SELLER) {
      throw new Error("Unauthorized Access: Seller Privileges Required.");
    }

    const foundStore = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });
    if (!foundStore) {
      throw new Error("You are not the owner of the store!");
    }

    // const orders = await db.orderGroup.findMany({
    //   where: {
    //     storeId: foundStore.id,
    //   },
    //   include: {
    //     items: true,
    //     coupon: true,
    //     order: {
    //       select: {
    //         paymentStatus: true,

    //         shippingAddress: {
    //           include: {
    //             country: true,
    //             user: {
    //               select: {
    //                 email: true,
    //               },
    //             },
    //           },
    //         },
    //         paymentDetails: true,
    //       },
    //     },
    //   },
    //   orderBy: {
    //     updatedAt: "desc",
    //   },
    // });

    // return orders;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((error as any).message);
  }
};

export const applySeller = async (store: StoreType) => {
  console.log("store", store);
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Ensure store data is provided
    if (!store) throw new Error("Please provide store data.");

    // Check if store with same name, email,url, or phone number already exists
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
        ],
      },
    });

    // If a store with same name, email, or phone number already exists, throw an error
    if (existingStore) {
      let errorMessage = "";
      if (existingStore.name === store.name) {
        errorMessage = "A store with the same name already exists";
      } else if (existingStore.email === store.email) {
        errorMessage = "A store with the same email already exists";
      } else if (existingStore.phone === store.phone) {
        errorMessage = "A store with the same phone number already exists";
      } else if (existingStore.url === store.url) {
        errorMessage = "A store with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert store details into the database
    const storeDetails = await db.store.create({
      data: {
        ...store,
        defaultShippingService:
          store.defaultShippingService || "International Delivery",
        returnPolicy: store.returnPolicy || "Return in 30 days.",
        userId: user.id,
      },
    });

    return storeDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function: getAllStores
// Description: Retrieves all stores from the database.
// Permission Level: Admin only
// Parameters: None
// Returns: An array of store details.
export const getAllStores = async () => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify admin permission
    if (user.privateMetadata.role !== "ADMIN") {
      throw new Error(
        "Unauthorized Access: Admin Privileges Required to View Stores."
      );
    }

    // Fetch all stores from the database
    const stores = await db.store.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return stores;
  } catch (error) {
    // Log and re-throw any errors
    console.log(error);
    throw error;
  }
};

export const updateStoreStatus = async (
  storeId: string,
  status: StoreStatus
) => {
  // Retrieve current user
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  // Verify admin permission
  if (user.privateMetadata.role !== "ADMIN")
    throw new Error(
      "Unauthorized Access: Admin Privileges Required for Entry."
    );

  const store = await db.store.findUnique({
    where: {
      id: storeId,
    },
  });

  // Verify seller ownership
  if (!store) {
    throw new Error("Store not found !");
  }

  // Retrieve the order to be updated
  const updatedStore = await db.store.update({
    where: {
      id: storeId,
    },
    data: {
      status,
    },
  });

  // Update the user role
  if (store.status === "PENDING" && updatedStore.status === "ACTIVE") {
    await db.user.update({
      where: {
        id: updatedStore.userId,
      },
      data: {
        role: "SELLER",
      },
    });
  }

  return updatedStore.status;
};

// Function: deleteStore
// Description: Deletes a store from the database.
// Permission Level: Admin only
// Parameters:
//   - storeId: The ID of the store to be deleted.
// Returns: Response indicating success or failure of the deletion operation.
export const deleteStore = async (storeId: string) => {
  try {
    // Get current user
    const user = await currentUser();

    // Check if user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify admin permission
    if (user.privateMetadata.role !== "ADMIN")
      throw new Error(
        "Unauthorized Access: Admin Privileges Required for Entry."
      );

    // Ensure store ID is provided
    if (!storeId) throw new Error("Please provide store ID.");

    // Delete store from the database
    const response = await db.store.delete({
      where: {
        id: storeId,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStorePageDetails = async (storeUrl: string) => {
  // Fetch the store details from the database
  const store = await db.store.findUnique({
    where: {
      url: storeUrl,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      description: true,
      logo: true,
      cover: true,
      averageRating: true,
      numReviews: true,
    },
  });

  // Handle case where the store is not found
  if (!store) {
    throw new Error(`Store with URL "${storeUrl}" not found.`);
  }
  return store;
};
