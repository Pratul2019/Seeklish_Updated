import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RentalModel from "@/Modals/Rental";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { username } = body;

    const rental = await RentalModel.find({ username }).sort({
      createdAt: -1,
    });

    return NextResponse.json(rental, { status: 200 });
  } catch (error: unknown) {
    console.error("Server error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
