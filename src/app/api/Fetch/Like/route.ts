import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

dbConnect();
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.username) {
    return redirect("/");
  }

  try {
    const { postid, model } = await request.json();
    //console.log('Post ID:', postid);
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

    const post = await modelInstance.findOne({ _id: postid });

    /*checkin user id is availabe in like array*/
    if (post.like.includes(session.user.username)) {
      await modelInstance.updateOne(
        { _id: postid },
        {
          $pull: { like: session.user.username },
        }
      );

      const postData = await modelInstance.findOne({ _id: postid });
      return NextResponse.json({
        message: "Like",
        data: postData.like,
        success: true,
      });
    }

    await modelInstance.updateOne(
      { _id: postid },
      {
        $push: { like: session.user.username },
      }
    );

    const postData = await modelInstance.findOne({ _id: postid });

    return NextResponse.json({
      message: "Liked",
      data: postData.like,
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
