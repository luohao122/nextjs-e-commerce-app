import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

import { User } from "@prisma/client";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Depend on the event trigger approriate action
  // Handle the sync between clerk and DB when creating new user
  if (evt.type === "user.created") {
    console.log("created");
    // Create user's payload
    const data = JSON.parse(body).data;

    const user: Partial<User> = {
      id: data.id,
      name:
        data.first_name !== null && data.last_name !== null
          ? `${data.first_name} ${data.last_name}`
          : `${data.email_addresses[0].email_address.split("@")[0]} user`,
      email: data.email_addresses[0].email_address,
      picture: data.image_url,
    };

    if (!user) {
      return;
    }

    // Create new user record in the DB and give it
    // a default USER role
    const dbUser = await db.user.create({
      data: {
        id: user.id!,
        email: user.email!,
        name: user.name!,
        picture: user.picture!,
        role: user.role || "USER",
      },
    });

    const client = await clerkClient();
    // Get the newly created user from clerk
    const existingMetadata = await client.users.getUser(data.id);

    // Make sure only update the user's metadata when the role did change
    // In the case of new user, the role didn't exist, so we proceed with the update
    if (existingMetadata.privateMetadata?.role !== dbUser.role) {
      await client.users.updateUserMetadata(data.id, {
        privateMetadata: { role: dbUser.role },
      });
    }

    return new Response("Webhook received", { status: 200 });
  }

  if (evt.type === "user.updated") {
    console.log("updated");

    const data = JSON.parse(body).data;
    const client = await clerkClient();
    // Get previous user data from Clerk
    const existingUser = await client.users.getUser(data.id);
    if (!existingUser) {
      return new Response("Error: User not found in DB", { status: 404 });
    }

    // Set the updated fields for the user record
    const user: Partial<User> = {
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0].email_address,
      picture: data.image_url,
      role: data.private_metadata?.role,
    };

    const existingDbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!existingDbUser) {
      return new Response("Error: User not found in DB", { status: 404 });
    }

    const onlyMetadataChanged =
      JSON.stringify(existingUser.firstName) ===
        JSON.stringify(data.first_name) &&
      JSON.stringify(existingUser.lastName) ===
        JSON.stringify(data.last_name) &&
      JSON.stringify(existingUser.emailAddresses) ===
        JSON.stringify(data.email_addresses) &&
      JSON.stringify(existingUser.imageUrl) ===
        JSON.stringify(data.image_url) &&
      existingUser.privateMetadata?.role === existingDbUser.role; // NEW CHECK

    if (onlyMetadataChanged) {
      return new Response("Ignoring metadata-only update with no role change", {
        status: 200,
      });
    }

    // Update the latest data to DB
    const dbUser = await db.user.update({
      where: {
        email: user.email,
      },
      data: {
        ...user,
      },
    });

    // Make sure only update the user's metadata when the role did change
    // in the case of a newly created user, this won't be trigger
    // since we already added the USER role above
    if (existingUser.privateMetadata?.role !== dbUser.role) {
      await client.users.updateUserMetadata(data.id, {
        privateMetadata: { role: dbUser.role },
      });
    }

    return new Response("Webhook received", { status: 200 });
  }

  // Handle sync data when user is removed from clerk
  if (evt.type === "user.deleted") {
    console.log("deleted");
    const userId = JSON.parse(body).data.id;
    await db.user.delete({
      where: {
        id: userId,
      },
    });
  }

  return new Response("Webhook received", { status: 200 });
}
