import { signOut } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import DeleterequestModel from "@/Modals/Deleterequest";
import UserModel from "@/Modals/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    await dbConnect();

    const user = await UserModel.findOne({ username: username });

    const deletedUser = new DeleterequestModel({
      username: username,
      email: user.email,
      uid: user.uid,
    });

    user.isdeleteuserrequest = true;
    await Promise.all([deletedUser.save(), user.save()]);
    // Sign out the user
    await signOut({ redirect: false });
    
    return NextResponse.json(
      { message: "Delete request received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting request:", error);
    return NextResponse.json(
      { message: "Error getting request" },
      { status: 500 }
    );
  }
}
