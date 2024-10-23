import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

// Function to delete an S3 object
const deleteS3Object = async (s3Client: S3Client, imageUrl: string) => {
  if (imageUrl) {
    const key = imageUrl.split("https://seeklish.s3.amazonaws.com/").pop();
    if (key) {
      console.log(`Deleting image: ${key}`); // Debug log: Image deletion started
      const deleteCommand = new DeleteObjectCommand({
        Bucket: "seeklish",
        Key: key,
      });
      await s3Client.send(deleteCommand);
      console.log(`Deleted image: ${key}`); // Debug log: Image deletion successful
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const { postid, model } = await request.json();
    console.log(`Received request to delete ${model} post ${postid}`); // Debug log: Request received

    await dbConnect();
    console.log("Database connected"); // Debug log: Database connection established

    const s3Client = new S3Client({
      region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
      },
    });

    console.log("S3 client initialized"); // Debug log: S3 client initialized

    let mainPost;
    if (model === "Rental") {
      mainPost = await RentalModel.findOne({ _id: postid });
    } else if (model === "Discover") {
      mainPost = await DiscoverModel.findOne({ _id: postid });
    } else if (model === "App") {
      mainPost = await ApplicationModel.findOne({ _id: postid });
    }

    if (mainPost) {
      console.log(`Found main ${model} post: ${mainPost._id}`); // Debug log: Main post found

      // Delete connected posts and their images
      if (Array.isArray(mainPost.connectionpost)) {
        for (const conn of mainPost.connectionpost) {
          await deleteS3Object(
            s3Client,
            model === "Rental" ? conn.rentalImage : conn.discoverImage
          );
        }
      }

      // Delete main post image
      await deleteS3Object(
        s3Client,
        model === "Rental" ? mainPost.rentalImage : mainPost.discoverImage
      );

      // Delete the main post
      if (model === "Rental") {
        await RentalModel.findByIdAndDelete(postid);
      } else if (model === "Discover") {
        await DiscoverModel.findByIdAndDelete(postid);
      } else if (model === "App") {
        await ApplicationModel.findByIdAndDelete(postid);
      }
    console.log(`Deleted ${model} post: ${postid}`); // Debug log: Main post deleted

      return NextResponse.json(
        { message: `${model} deleted successfully` },
        { status: 200 }
      );
    } else {
      console.error(`Post not found: ${postid}`); // Debug log: Post not found
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error deleting post: ${error}`); // Debug log: Error deleting post
    return NextResponse.json(
      { message: "Error deleting post" },
      { status: 500 }
    );
  }
}
