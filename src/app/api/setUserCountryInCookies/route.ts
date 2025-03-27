import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userCountry } = body;
    if (!userCountry) {
      return new NextResponse("User country data invalid.", { status: 400 });
    }

    const response = new NextResponse("User country data saved.", {
      status: 200,
    });
    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true, // make sure the cookie cannot be accessed by javascript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // protect against CSRF attacks
    });

    return response;
  } catch {
    return new NextResponse("Couldn't set users country", { status: 500 });
  }
}
