import { generateUsername } from "@/Components/Username/generateUsername";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Modals/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, uid, image } = await request.json();

  await dbConnect();

  // Check if a user with the same uid already exists
  let user = await UserModel.findOne({ uid });

  if (user) {
    // If user exists, return their current information
    return NextResponse.json(
      {
        message: "User already exists",
        username: user.username,
        name: user.name,
        image: user.image,
        isdeleteuserrequest: user.isdeleteuserrequest,
      },
      {
        status: 200,
      }
    );
  }

  // If not, create a new user
  const username = generateUsername(name);
  user = await UserModel.create({ name, email, uid, image, username });

  return NextResponse.json(
    {
      message: "User registered",
      username: user.username,
      name: user.name,
      image: user.image,
    },
    {
      status: 201,
    }
  );
}