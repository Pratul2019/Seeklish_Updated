import dbConnect from "@/lib/dbConnect";
import DiscoverModel from "@/Modals/Discover";
import { NextResponse } from "next/server";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export async function GET(req: Request) {
  await dbConnect();

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || DEFAULT_PAGE.toString(), 10);
  const limit = parseInt(url.searchParams.get("limit") || DEFAULT_LIMIT.toString(), 10);

  if (isNaN(page) || isNaN(limit)) {
    return NextResponse.json({ error: "Invalid page or limit parameter" }, { status: 400 });
  }

  const skip = (page - 1) * limit;

  try {
    const discovers = await DiscoverModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await DiscoverModel.countDocuments();

    return NextResponse.json({
      discovers,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}