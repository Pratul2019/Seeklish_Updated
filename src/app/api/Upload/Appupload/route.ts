import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import UserModel from "@/Modals/User";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, appName, caption, place } = await request.json();
  await dbConnect();

  const existingUser = await UserModel.findOne({ username });
  
  if (!existingUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await ApplicationModel.create({
    username,
    appName,
    name: existingUser.name,
    caption,
    place,
    image: existingUser.image,
  });

  return NextResponse.json(
    { message: "Cityapp Post Created" },
    { status: 200 }
  );
}
