import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RentalModel from "@/Modals/Rental";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log("Received GET request");

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

    console.time("Search query execution");
    const results = await RentalModel.aggregate([
      {
        $search: {
          index: "Rental",
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: "rentalName",
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
          rentalName: 1,
          image: 1,
          rentalImage: 1,
          caption: 1,
          username: 1,
          place: 1,
          like: 1,
          comment: 1,
          connectionrental: { $ifNull: [ "$connectionrental", [] ] }
        },
      },
    ]);
    console.timeEnd("Search query execution");

    console.log("Search results:", results);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  } finally {
    console.log("Database disconnected");
  }
}