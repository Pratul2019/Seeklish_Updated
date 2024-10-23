import dbConnect from "@/lib/dbConnect";
import RentalModel from "@/Modals/Rental";
import UserModel from "@/Modals/User";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {
    postid,
    profileusername,
    currentusername,
    rentalName,
    caption,
    place,
    rentalImage,
  } = await request.json();

  await dbConnect();

  const existingUser = await UserModel.findOne({ username: currentusername });
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

  const putObject = async (
    profileusername: string,
    postid: string,
    filename: string,
    contentType: string
  ) => {
    if (!rentalImage.match(/^data:image\/\w+;base64,/)) {
      throw new Error("Invalid base64-encoded image data");
    }
    const command = new PutObjectCommand({
      Bucket: "seeklish",
      Key: `Rentals/${profileusername}/${postid}/${filename}`,
      ContentType: contentType,
      Body: Buffer.from(
        rentalImage.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
    });
    return s3Client.send(command);
  };

  try {
    const filename = `${new Date().getTime()}.jpg`;
    await putObject(
      profileusername,
      postid,
      filename,
      "image/jpeg"
    );
    const objectURL = `https://seeklish.s3.amazonaws.com/Rentals/${profileusername}/${postid}/${filename}`;

    const newRental = await RentalModel.updateOne(
      { _id: postid },
      {
        $push: {
          connectionpost: {
            username: currentusername,
            image: existingUser.image,
            name: existingUser.name,
            rentalName,
            caption,
            place,
            rentalImage: objectURL,
          },
        },
      }
    );

    // Update the current user's connectpostrental array with the postid
    await UserModel.updateOne(
      { username: currentusername },
      {
        $addToSet: {
          connectpostrental: postid,
        },
      }
    );

    return NextResponse.json(
      { message: "Rental Post Created", data: newRental },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error uploading image" },
      { status: 500 }
    );
  }
}
