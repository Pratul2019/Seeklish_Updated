import dbConnect from "@/lib/dbConnect";
import DeleterequestModel from "@/Modals/Deleterequest";
import UserModel from "@/Modals/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    await dbConnect();

    const user = await UserModel.findOne({ username: username });
    await DeleterequestModel.deleteOne({ username: username });
    user.isdeleteuserrequest = false;
    await Promise.all([user.save()]);
    // Sign out the user

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
