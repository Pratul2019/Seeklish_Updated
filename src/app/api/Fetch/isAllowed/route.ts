import { auth } from "@/auth";
import UserModel from "@/Modals/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  const {
    profileUser,
    checkedUsernames,
  }: { profileUser: string; checkedUsernames: string[] } = await request.json();

  // Check for unauthorized access
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await UserModel.findOne({ username: profileUser });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Convert connections to a plain JavaScript object
    const updatedConnections = Object.fromEntries(user.connections);

    // Get all usernames from connections
    const allUsernames = Object.keys(updatedConnections);

    // Type for the update object to avoid using `any`
    type UpdateType = Record<string, boolean>;

    // Update isallowed to true for checked usernames
    const updateAllowed = async (checkedUsernames: string[]) => {
      const update: UpdateType = {};
      checkedUsernames.forEach((username: string) => {
        update[`connections.${username}.isallowed`] = true;
      });
      await UserModel.updateMany({ username: profileUser }, update);
    };

    // Get unchecked usernames
    const uncheckedUsernames = allUsernames.filter(
      (username) => !checkedUsernames.includes(username)
    );

    // Update isallowed to false for unchecked usernames
    const updateNotAllowed = async (uncheckedUsernames: string[]) => {
      const update: UpdateType = {};
      uncheckedUsernames.forEach((username: string) => {
        update[`connections.${username}.isallowed`] = false;
      });
      await UserModel.updateMany({ username: profileUser }, update);
    };

    // Perform the updates
    await updateAllowed(checkedUsernames);
    await updateNotAllowed(uncheckedUsernames);

    return NextResponse.json({
      message: "completed",
      data: {
        allowedUsers: checkedUsernames,
        blockedUsers: uncheckedUsernames,
      },
      success: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message || "Unknown error occurred",
          success: false,
          error: true,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "An unknown error occurred",
        success: false,
        error: true,
      },
      { status: 500 }
    );
  }
}
