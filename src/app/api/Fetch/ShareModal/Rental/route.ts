import dbConnect from "@/lib/dbConnect";
import RentalModel from "@/Modals/Rental";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  
  const { postid } = await request.json();
  //console.log("postid",postid);

  try {

    const rentalPost = await RentalModel.findOne({ _id: postid });

    if (!rentalPost) {
      return NextResponse.json({ message: "Rental not found", success: false });
    }

    return NextResponse.json({
      message: "Rental fetched successfully",
      data: rentalPost,
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
