import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";
import UserModel from "@/Modals/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection is established
    await dbConnect();

    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { message: "Username is required", success: false },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    const discoverprofile = await DiscoverModel.find({ username }).sort({
      createdAt: -1,
    });

    const rentalprofile = await RentalModel.find({ username }).sort({
      createdAt: -1,
    });

    const applicationprofile = await ApplicationModel.find({ username }).sort({
      createdAt: -1,
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User found",
      data: {
        user,
        discoverprofile: discoverprofile,
        rentalprofile: rentalprofile,
        applicationprofile: applicationprofile,
      },
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
