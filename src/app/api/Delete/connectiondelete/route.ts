import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import DiscoverModel from "@/Modals/Discover";
import RentalModel from "@/Modals/Rental";
import UserModel from "@/Modals/User";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

// Define a general interface for connectionpost objects
interface ConnectionPost {
  _id: string;
  image: string;
  caption: string;
  username: string;
  name: string;
  rentalName?: string;
  rentalImage?: string;
  discoverName?: string;
  discoverImage?: string;
  appName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { postId, connectionpostId, model } = await request.json();
    // console.log(`Received request to delete connection post with postId: ${postId}, connectionpostId: ${connectionpostId}, and model: ${model}`);

    await dbConnect();
    // console.log("Database connection established");

    let connection;
    let username: string | undefined;
    let user;

    if (model === "Rental") {
      connection = await RentalModel.findOne({ _id: postId });
      // console.log(`Found rental connection: ${connection}`);
      
      const foundPost = connection.connectionpost.find((post: ConnectionPost) => post._id.toString() === connectionpostId);
    
      if (foundPost) {
        username = foundPost.username;
        const postCount = connection.connectionpost.filter(
          (post: ConnectionPost) => post.username === username
        ).length;
        // console.log(`User ${username} has ${postCount} posts`);
    
        if (postCount === 1) {
          // console.log("Last post, updating user");
          user = await UserModel.findOne({ username });
          // console.log(`Found user: ${user}`);
          user?.connectpostrental.pull(postId);
          await user?.save();
          // console.log("User updated");
        } else {
          // console.log("More than one post, not updating user");
        }
      } else {
        // console.log("Connection post not found");
        // Handle the case where the connection post is not found
      }
    }else if (model === "Discover") {
      connection = await DiscoverModel.findOne({ _id: postId });
      // console.log(`Found discover connection: ${connection}`);
    
      const foundPost = connection.connectionpost.find((post: ConnectionPost) => post._id.toString() === connectionpostId);
    
      if (foundPost) {
        username = foundPost.username;
        const postCount = connection.connectionpost.filter(
          (post: ConnectionPost) => post.username === username
        ).length;
        // console.log(`User ${username} has ${postCount} posts`);
    
        if (postCount === 1) {
          // console.log("Last post, updating user");
          user = await UserModel.findOne({ username });
          // console.log(`Found user: ${user}`);
          user?.connectpostdiscover.pull(postId);
          await user?.save();
          // console.log("User updated");
        } else {
          // console.log("More than one post, not updating user");
        }
      } else {
        // console.log("Connection post not found");
        // Handle the case where the connection post is not found
      }
    } else if (model === "App") {
      connection = await ApplicationModel.findOne({ _id: postId });
      // console.log(`Found application connection: ${connection}`);
      
      const foundPost = connection.connectionpost.find((post: ConnectionPost) => post._id.toString() === connectionpostId);
    
      if (foundPost) {
        username = foundPost.username;
        const postCount = connection.connectionpost.filter(
          (post: ConnectionPost) => post.username === username
        ).length;
        // console.log(`User ${username} has ${postCount} posts`);
    
        if (postCount === 1) {
          // console.log("Last post, updating user");
          user = await UserModel.findOne({ username });
          // console.log(`Found user: ${user}`);
          user?.connectpostapplication.pull(postId);
          await user?.save();
          // console.log("User updated");
        } else {
          // console.log("More than one post, not updating user");
        }
      } else {
        // console.log("Connection post not found");
        // Handle the case where the connection post is not found
      }
    }

    if (connection) {
      const connectionPostIndex = connection.connectionpost.findIndex(
        (post: ConnectionPost) => post._id.toString() === connectionpostId
      );
      // console.log(`Connection post index: ${connectionPostIndex}`);

      if (connectionPostIndex !== -1) {
        const connectionPost = connection.connectionpost[connectionPostIndex];
        const imageKey = connectionPost.rentalImage || connectionPost.discoverImage || connectionPost.image;
        // console.log(`Image key: ${imageKey}`);

        if (imageKey) {
          const key = imageKey.split("https://seeklish.s3.amazonaws.com/").pop();
          // console.log(`S3 key: ${key}`);
          const s3Client = new S3Client({
            region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
            credentials: {
              accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
            },
          });
          const deleteCommand = new DeleteObjectCommand({
            Bucket: "seeklish",
            Key: key!,
          });
          // console.log(`Deleting image from S3...`);
          await s3Client.send(deleteCommand);
          // console.log("Image deleted from S3");
        }

        connection.connectionpost.splice(connectionPostIndex, 1);
        await connection.save();
        // console.log("Connection updated");
      }
    }

    return NextResponse.json(
      { message: "Connection deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting connection :", error);
    return NextResponse.json(
      { message: "Error deleting connection " },
      { status: 500 }
    );
  }
}