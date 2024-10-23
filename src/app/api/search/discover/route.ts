import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import DiscoverModel from "@/Modals/Discover";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log("Received GET request for Discover search");

    const query = req.nextUrl.searchParams.get("query");
    console.log("Query parameter:", query);

    if (!query) {
      console.log("Query parameter is required");
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("Database connected");

    console.time("Discover search query execution");
    const results = await DiscoverModel.aggregate([
      {
        $search: {
          index: "Discover",
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: "discoverName",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1
                  }
                }
              },
              {
                text: {
                  query: query,
                  path: "place",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 1
                  }
                }
              }
            ]
          }
        }
      },
      // {
      //   $limit: 10,
      // },
      {
        $project: {
          _id: 1,
          name: 1,
          discoverName: 1,
          image: 1,
          discoverImage: 1,
          caption: 1,
          username: 1,
          place: 1,
          like: 1,
          comment: 1,
          connectiondiscover: { $ifNull: [ "$connectiondiscover", [] ] }
        },
      },
    ]);
    console.timeEnd("Discover search query execution");

    console.log("Discover search results:", results);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in Discover search:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}