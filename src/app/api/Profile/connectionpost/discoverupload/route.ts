import dbConnect from "@/lib/dbConnect";
import LocalModel from "@/Modals/Discover";
import UserModel from "@/Modals/User";
import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  
    const { postid, profileusername, currentusername, discoverName, caption, place, discoverImage } = await request.json();
  
    await dbConnect();
    
  
    const existingUser = await UserModel.findOne({ username: currentusername });
    //console.log('Existing user:', existingUser);
  
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
    //console.log('S3 client created');
    
  
    async function putObject(profileusername: string, postid: string, filename: string, contentType: string) {
        //console.log('Uploading image to S3');
      if (!discoverImage.match(/^data:image\/\w+;base64,/)) {
        throw new Error("Invalid base64-encoded image data");
      }
      const command = new PutObjectCommand({
        Bucket: "seeklish",
        Key: `Discovers/${profileusername}/${postid}/${filename}`,
        ContentType: contentType,
        Body: Buffer.from(discoverImage.replace(/^data:image\/\w+;base64,/, ''), 'base64')
      });
      const uploadResult = await s3Client.send(command);
      //console.log('Image uploaded to S3:', uploadResult);
      return uploadResult;
    }
  
    try {
      const filename = `${new Date().getTime()}.jpg`;
      await putObject(profileusername, postid, filename, 'image/jpeg');
      const objectURL = `https://seeklish.s3.amazonaws.com/Discovers/${profileusername}/${postid}/${filename}`;
      //console.log('Image URL:', objectURL);
  
      const newlocal = await LocalModel.updateOne({ _id: postid },
        {
          $push: {
            connectionpost: {
              username: currentusername,
              image: existingUser.image,
              name: existingUser.name,
              discoverName,
              caption,
              place,
              discoverImage: objectURL,
            },
          },
        }
      );
      await UserModel.updateOne(
        { username: currentusername },
        {
          $addToSet: {
            connectpostdiscover: postid,
          },
        }
      );
  
      return NextResponse.json(
        { message: "Rental Post Created", data: newlocal },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
        { message: "Error uploading image" },
        { status: 500 }
      );
    }
  }