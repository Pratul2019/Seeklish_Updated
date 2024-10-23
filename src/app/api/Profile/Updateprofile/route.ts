import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";
import UserModel from "@/Modals/User";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, name, image } = await request.json();

  await dbConnect();

  const existingUser = await UserModel.findOne({ username });

  if (!existingUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
    },
  });

  async function putObject(
    username: string,
    filename: string,
    contentType: string
  ) {
    //console.log("Uploading image to S3");
    const command = new PutObjectCommand({
      Bucket: "seeklish",
      Key: `Profile/${username}/${filename}`,
      ContentType: contentType,
      Body: Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
    });
    const uploadResult = await s3Client.send(command);

    return uploadResult;
  }

  async function deleteObject(objectURL: string) {
    const key = objectURL.split("https://seeklish.s3.amazonaws.com/").pop();
    const command = new DeleteObjectCommand({
      Bucket: "seeklish",
      Key: key,
    });
    await s3Client.send(command);
  }

  async function updateAudience() {
    // Get usernames from connections and audience
    const connections = existingUser.connections;
    for (const connectedUsername of connections) {
      // console.log(`Updating audience for connected user: ${connectedUsername}`);

      // Find user ID in UserModal
      const connectedUser = await UserModel.findOne({
        username: connectedUsername,
      });

      if (connectedUser) {
        // console.log(`Found user ID for connected user: ${connectedUser.username}`);

        // Update name and image in audience list
        connectedUser.audience.set(existingUser.username, {
          name: existingUser.name,
          image: existingUser.image,
        });

        await connectedUser.save();

        // console.log(
        //   `Updated audience for connected user: ${connectedUsername}`
        // );
      } else {
        console.log(`User not found for connected user: ${connectedUsername}`);
      }
    }
  }

  async function updateConnections() {
    // Get usernames from connections and audience
    const audiences = existingUser.audience;
    for (const connectedUsername of audiences) {
      // console.log(`Updating audience for connected user: ${connectedUsername}`);

      // Find user ID in UserModal
      const connectedUser = await UserModel.findOne({
        username: connectedUsername,
      });

      if (connectedUser) {
        // console.log(`Found user ID for connected user: ${connectedUser.username}`);

        // Update name and image in audience list
        connectedUser.connections.set(existingUser.username, {
          name: existingUser.name,
          image: existingUser.image,
        });

        await connectedUser.save();

        // console.log(
        //   `Updated audience for connected user: ${connectedUsername}`
        // );
      } else {
        console.log(`User not found for connected user: ${connectedUsername}`);
      }
    }
  }

  try {
    if (name) {
      existingUser.name = name;
    }
    if (image !== null && image !== "") {
      if (existingUser.image) {
        await deleteObject(existingUser.image);
      }
      const filename = `${new Date().getTime()}.jpg`;
      await putObject(username, filename, "image/jpeg");
      const objectURL = `https://seeklish.s3.amazonaws.com/Profile/${username}/${filename}`;
      existingUser.image = objectURL;
    }

    // Update posts in RentalModal
    await RentalModel.updateMany(
      {
        $or: [{ username: existingUser.username }],
      },

      {
        $set: {
          name: existingUser.name,
          image: existingUser.image,
        },
      }
    );

    // Update posts in LocalModal
    await DiscoverModel.updateMany(
      {
        $or: [{ username: existingUser.username }],
      },

      {
        $set: {
          name: existingUser.name,
          image: existingUser.image,
        },
      }
    );

    // Update posts in CityModal
    await ApplicationModel.updateMany(
      {
        $or: [{ username: existingUser.username }],
      },
      {
        $set: {
          name: existingUser.name,
          image: existingUser.image,
        },
      }
    );

    await RentalModel.updateMany(
      {
        "connectionpost.username": existingUser.username,
      },
      {
        $set: {
          "connectionpost.$[elem].name": existingUser.name,
          "connectionpost.$[elem].image": existingUser.image,
        },
      },
      {
        arrayFilters: [{ "elem.username": existingUser.username }],
      }
    );

    await DiscoverModel.updateMany(
      {
        "connectionpost.username": existingUser.username,
      },
      {
        $set: {
          "connectionpost.$[elem].name": existingUser.name,
          "connectionpost.$[elem].image": existingUser.image,
        },
      },
      {
        arrayFilters: [{ "elem.username": existingUser.username }],
      }
    );

    await ApplicationModel.updateMany(
      {
        "connectionpost.username": existingUser.username,
      },
      {
        $set: {
          "connectionpost.$[elem].name": existingUser.name,
          "connectionpost.$[elem].image": existingUser.image,
        },
      },
      {
        arrayFilters: [{ "elem.username": existingUser.username }],
      }
    );
    await RentalModel.updateMany(
      {
        "comment.username": existingUser.username,
      },
      {
        $set: {
          "comment.$[elem].name": existingUser.name,
          "comment.$[elem].image": existingUser.image,
        },
      },
      {
        arrayFilters: [{ "elem.username": existingUser.username }],
      }
    );

    await DiscoverModel.updateMany(
      {
        "comment.username": existingUser.username,
      },
      {
        $set: {
          "comment.$[elem].name": existingUser.name,
          "comment.$[elem].image": existingUser.image,
        },
      },
      {
        arrayFilters: [{ "elem.username": existingUser.username }],
      }
    );

    await ApplicationModel.updateMany(
      {
        "comment.username": existingUser.username,
      },
      {
        $set: {
          "comment.$[elem].name": existingUser.name,
          "comment.$[elem].image": existingUser.image,
        },
      },
      {
        arrayFilters: [{ "elem.username": existingUser.username }],
      }
    );

    await updateAudience();
    console.log(`auidenice udpdated `);

    await updateConnections();
    console.log(`connections udpdated `);

    await existingUser.save();

    return NextResponse.json(
      {
        message: "User updated successfully",
        data: {
          name: existingUser.name,
          image: existingUser.image,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}
