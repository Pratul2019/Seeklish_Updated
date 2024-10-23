import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  const { postid } = await request.json();
  //console.log("postid",postid);

  try {
    const appPost = await ApplicationModel.findOne({ _id: postid });

    if (!appPost) {
      return NextResponse.json({ message: "App not found", success: false });
    }

    return NextResponse.json({
      message: "App fetched successfully",
      data: appPost,
      success: true,
    });
  } catch (error: unknown) {
    // Use `unknown` instead of `any`
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message || "Unknown error occurred",
        error: true,
      });
    } else {
      return NextResponse.json({
        message: "An unexpected error occurred",
        error: true,
      });
    }
  }
}
