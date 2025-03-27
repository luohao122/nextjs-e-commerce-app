import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { getUserCountry } from "@/lib/utils";

export default clerkMiddleware(async (auth, req) => {
  const protectedRoutes = createRouteMatcher(["/dashboard", "/dashboard/(.*)"]);
  if (protectedRoutes(req)) {
    await auth.protect();
  }

  let response = NextResponse.next();

  const countryCookie = req.cookies.get("userCountry");

  if (countryCookie) {
    response = NextResponse.next();
  } else {
    response = NextResponse.redirect(new URL(req.url));
    const userCountry = await getUserCountry();

    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
