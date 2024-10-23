import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const { postid, model } = await request.json();

    let modelInstance;
    switch (model) {
      case "App":
        modelInstance = ApplicationModel;
        break;
      case "Rental":
        modelInstance = RentalModel;
        break;
      case "Discover":
        modelInstance = DiscoverModel;
        break;
      default:
        return NextResponse.json({ message: "Invalid model" });
    }

    const commentList = await modelInstance.find({ _id: postid }).populate({
      path: "comment",
      options: { sort: { createdAt: -1 } }, // Sorting in descending order by `createdAt`
    });

    return NextResponse.json({
      message: "comment",
      data: commentList,
      success: true,
    });
  } catch (error: unknown) {
    // Narrow the error type to ensure we can access its properties safely
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        error: true,
      });
    } else {
      return NextResponse.json({
        message: "Unknown error occurred",
        error: true,
      });
    }
  }
}
