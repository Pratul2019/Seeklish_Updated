import dbConnect from "@/lib/dbConnect";
import RentalModel from "@/Modals/Rental";
import UserModel from "@/Modals/User";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

async function putObject(username: string, filename: string, contentType: string, imageData: string) {
  const command = new PutObjectCommand({
    Bucket: "seeklish",
    Key: `Rentals/${username}/${filename}`,
    ContentType: contentType,
    Body: Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  });
  return await s3Client.send(command);
}

export async function POST(request: NextRequest) {
  //console.log("Rental post creation API called");
  try {
    const { username, rentalName, caption, place, rentalImage } = await request.json();
    //console.log(`Received data: username=${username}, rentalName=${rentalName}, place=${place}`);

    await dbConnect();
    //console.log("Connected to database");

    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      //console.log(`User not found: ${username}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    //console.log(`User found: ${existingUser.name}`);

    const filename = `${Date.now()}.jpg`;
    //console.log(`Uploading image: ${filename}`);
    await putObject(username, filename, 'image/jpeg', rentalImage);
    //console.log("Image uploaded successfully");

    const objectURL = `https://seeklish.s3.amazonaws.com/Rentals/${username}/${filename}`;

    const newRental = new RentalModel({
      username,
      image: existingUser.image,
      name: existingUser.name,
      rentalName,
      caption,
      place,
      rentalImage: objectURL,
    });

    //console.log("Saving rental to database");
    await newRental.save();
    //console.log(`Rental saved successfully. ID: ${newRental._id}`);

    return NextResponse.json(
      { message: "Rental Post Created", data: newRental },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in rental post creation:", error);
    return NextResponse.json(
      { message: "Error creating rental post", error: (error as Error).message },
      { status: 500 }
    );
  }
}