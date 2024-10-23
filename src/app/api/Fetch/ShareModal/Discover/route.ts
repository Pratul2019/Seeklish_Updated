import dbConnect from "@/lib/dbConnect";
import DiscoverModel from "@/Modals/Discover";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  const { postid } = await request.json();
  //console.log("postid",postid);

  try {
    const discoverPost = await DiscoverModel.findOne({ _id: postid });

    if (!discoverPost) {
      return NextResponse.json({
        message: "Discover not found",
        success: false,
      });
    }

    return NextResponse.json({
      message: "Discover fetched successfully",
      data: discoverPost,
      success: true,
    });
  } catch (error: unknown) {  // Use `unknown` instead of `any`
    if (error instanceof Error) {
        return NextResponse.json({
            message: error.message || 'Unknown error occurred',
            error: true
        });
    } else {
        return NextResponse.json({
            message: 'An unexpected error occurred',
            error: true
        });
    }
  }
}
