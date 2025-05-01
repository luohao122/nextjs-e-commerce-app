import { NextResponse } from "next/server";

import client from "@/lib/elasticsearch";

// Define product type
interface Product {
  name: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("search");

  if (!q || typeof q !== "string") {
    return NextResponse.json(
      {
        message: "Invalid search query",
      },
      { status: 400 }
    );
  }

  try {
    const response = await client.search<{ _source: Product }>({
      index: "products",
      body: {
        query: {
          match_phrase_prefix: {
            name: q,
          },
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = response.hits.hits.map((hit: any) => hit._source);
    return NextResponse.json(results);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
