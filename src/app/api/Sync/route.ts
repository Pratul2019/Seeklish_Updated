import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Modals/User";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
dbConnect();

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({
      message: "User not authenticated",
      success: false,
    });
  }

  try {
    const {
      currentUser,
      profileUser,
      action,
      profileUsername,
      profileUserimage,
    } = await request.json();

    // Ensure both currentUser and profileUser are provided
    if (!currentUser || !profileUser) {
      return NextResponse.json({
        message: "Missing required parameters",
        success: false,
      });
    }

    const user = await UserModel.findOne({ username: currentUser });
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }

    const currentUsername = user.name;
    const currentUserimage = user.image;

    if (action === "Sync") {
      // Add current user to profile user's audience and connections
      await UserModel.updateOne(
        { username: profileUser },
        {
          $set: {
            [`audience.${currentUser}`]: {
              name: currentUsername,
              image: currentUserimage,
            },
          },
        }
      );

      await UserModel.updateOne(
        { username: currentUser },
        {
          $set: {
            [`connections.${profileUser}`]: {
              name: profileUsername,
              image: profileUserimage,
            },
          },
        }
      );
    } else if (action === "Unsync") {
      // Remove current user from profile user's audience and connections
      await UserModel.updateOne(
        { username: profileUser },
        {
          $unset: {
            [`audience.${currentUser}`]: "",
          },
        }
      );

      await UserModel.updateOne(
        { username: currentUser },
        {
          $unset: {
            [`connections.${profileUser}`]: "",
          },
        }
      );
    } else {
      return NextResponse.json({
        message: "Invalid action specified",
        success: false,
      });
    }

    // Return a successful response
    return NextResponse.json({
      message: `${action} action completed successfully.`,
      success: true,
    });
  } catch (error: unknown) {
    // Handle errors gracefully
    console.error("Error handling sync action:", error instanceof Error ? error.message : error);
    return NextResponse.json({
      message: "Internal server error.",
      success: false,
    });
  }
}
