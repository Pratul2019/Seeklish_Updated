import dbConnect from "@/lib/dbConnect";
import CityappModel from "@/Modals/Application";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { postid, commentid, model } = await request.json();
    await dbConnect();

    let modelInstance;
    switch (model) {
      case "Cityapp":
        modelInstance = CityappModel;
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
    // Use the Rental model to delete the document with the specified postid
    const result = await modelInstance.updateOne(
      { _id: postid },
      { $pull: { comment: { _id: commentid } } }
    );

    if (result.modifiedCount === 0) {
      // No documents were modified, possibly because the comment was not found
      return NextResponse.json(
        { message: "Comment not found or rental post not found" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the comment" },
      { status: 500 } // Internal Server Error
    );
  }
}
