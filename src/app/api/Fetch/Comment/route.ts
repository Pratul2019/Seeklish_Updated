import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";
import UserModel from "@/Modals/User";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  const session = await auth();
  
  const { postid, description, model, username } = await request.json() as {
    postid: string;
    description: string;
    model: "App" | "Rental" | "Discover";  // Narrowed model types
    username: string;
  };

  if (!session?.user) {
    return;
  }

  const existingUser = await UserModel.findOne({ username });
  if (!existingUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  try {
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

    await modelInstance.updateOne(
      { _id: postid },
      {
        $push: {
          comment: {
            username: session.user.username,
            description,
            name: existingUser.name,
            image: existingUser.image,
            timestamp: new Date(),
          },
        },
      }
    );

    const commentList = await modelInstance.find({ _id: postid }).populate({
      path: 'comment',
      options: { sort: { createdAt: -1 } }, // Sorting in descending order by `createdAt`
    });

    return NextResponse.json({
      message: "comment",
      data: commentList,
      success: true,
    });
  } catch (error: unknown) {
    // Type narrowing for `error`
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        error: true,
      });
    }
    return NextResponse.json({
      message: "Unknown error occurred",
      error: true,
    });
  }
}
