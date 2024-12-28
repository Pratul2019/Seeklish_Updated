import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";

const ModelMap = {
  discover: DiscoverModel,
  rental: RentalModel,
};

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { location, category } = body;

  if (category !== "discover" && category !== "rental") {
    return NextResponse.json({ message: "Invalid category" }, { status: 400 });
  }

  const Model = ModelMap[category as keyof typeof ModelMap];
  const existingLocation = await Model.findOne({ place: location });

  if (!existingLocation) {
    return NextResponse.json({ message: "Location not found" }, { status: 202 });
  }

  const response = await Model.findById(existingLocation._id).select(
    "username image name rentalName _id"
  );

  // Check if response is an array
  if (Array.isArray(response)) {
    return NextResponse.json(response[0], { status: 200 }); // Return the first document
  } else {
    return NextResponse.json(response, { status: 200 });
  }
}